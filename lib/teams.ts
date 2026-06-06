'use server';

import { Team, Role, TeamMember } from "@/types";
import { contentDb, usersDb } from './db';
import { getCitiesWithinRange } from "./location";
import { prepDataForDb, removeLeadingArticles } from "./helper-functions";
import { getCurrentUser } from "./users";
import { destroyImage } from "./cloudinary";

const convertDataToTeam = (data: {[key: string]: string | null}): Team => {
    return {
        id: data.id || '',
        name: data.name || '',
        image: data.image || null,
        photoCredit: data.photoCredit || null,
        city: data.city || null,
        state: data.state || null,
        theatres: data.theatres?.split(',') || [],
        lookingForPlayers: Boolean(data.lookingForPlayers),
        lookingForCoach: Boolean(data.lookingForCoach),
        lookingForMusician: Boolean(data.lookingForMusician),
        description: data.description || null
    }
}

const convertDataToTeamMember = (data: {[key: string]: string | null}): TeamMember => {
    let confirmed = null;
    if (typeof data.confirmed === 'number') confirmed = Boolean(data.confirmed);
    return {
        team: data.team as string,
        name: data.name as string,
        id: data.id,
        role: data.role as Role,
        dateAdded: data.dateAdded as string,
        addedBy: data.addedBy as string,
        confirmed
    }
}

export async function getTeam(id: string): Promise<Team | null> {
    const data = await contentDb.prepare('SELECT * FROM teams WHERE id = ?').get(id) as {[key: string]: string | null};
    return data ? convertDataToTeam(data) : null;
}

export async function getAllTeams(): Promise<{ name: string, id: string, image?: string }[]> {
    return contentDb
        .prepare(`SELECT name, id, image FROM teams`).all() as { name: string, id: string, image?: string }[];
}

export async function getTeamsByTheatre(theatre: string) {
    const data = contentDb.prepare('SELECT * FROM teams WHERE theatres LIKE ?').all(`%${removeLeadingArticles(theatre)}%`) as {[key: string]: string | null}[];
    return data.map(convertDataToTeam);
}

export async function getTeamsInRange(cityOrZipcode: string, miles: number) {
    const citiesInRange = getCitiesWithinRange(cityOrZipcode, miles);
    const data = contentDb.prepare(
        `SELECT * FROM teams WHERE (city || ' ' || state) IN (${citiesInRange.map(() => '?').join(', ')}) COLLATE NOCASE`
    ).all(...citiesInRange) as {[key: string]: string | null}[];
    return data.map(convertDataToTeam);
}

export async function getTeamsByUser(id: string): Promise<Team[]> {
    const teamMemberships = contentDb.prepare('SELECT team FROM team_members WHERE id = ?').all(id) as { team: string }[];
    if (!teamMemberships.length) return [];
    const queries = teamMemberships.map(() => `id = ?`).join(' OR ');
    const data = contentDb.prepare(
        `SELECT * FROM teams WHERE ${queries}`
    ).all(...teamMemberships.map((tm) => tm.team)) as {[key: string]: string | null}[];
    return data.map(convertDataToTeam);
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const data = contentDb.prepare('SELECT * FROM team_members WHERE team = ?').all(teamId) as {[key: string]: string | null}[];
    return data.map(convertDataToTeamMember);
}

export async function getTeamInvitations(userId: string): Promise<TeamMember[]> {
    const data = contentDb.prepare('SELECT * FROM team_members WHERE id = ? AND confirmed = 0').all(userId) as {[key: string]: string | null}[];
    return data.map(convertDataToTeamMember);
}

export async function respondToTeamInvitation(teamId: string, userId: string, role: string, accept: boolean): Promise<void> {
    const action = accept ? 'UPDATE team_members SET confirmed = 1' : 'DELETE FROM team_members';
    contentDb.prepare(`${action} WHERE team = ? AND id = ? AND role = ?`).run(teamId, userId, role);
    if (!accept) deleteTeamIfNooneLeft(teamId);
}

export async function saveTeam(team: Team, members: { name: string, id: string | null, role: Role }[]): Promise<string> {
    let isUnique = false;
    let counter = 1;
    const id = team.id;
    while (!isUnique) {
        isUnique = !Boolean(await getTeam(team.id));
        if (!isUnique) {
            counter++;
            team.id = `${id}-${counter}`;
        }
    }

    contentDb.prepare(`
        INSERT INTO teams (
            id,
            name,
            image,
            photoCredit,
            city,
            state,
            theatres,
            lookingForPlayers,
            lookingForCoach,
            lookingForMusician,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        team.id,
        team.name,
        team.image,
        team.photoCredit,
        team.city,
        team.state,
        team.theatres?.join(',') || null,
        team.lookingForPlayers ? 1 : 0,
        team.lookingForCoach ? 1 : 0,
        team.lookingForMusician ? 1 : 0,
        team.description,
    );

    const creator = (await getCurrentUser())?.id;

    const timestamp = new Date().toISOString();
    const statement = `INSERT INTO team_members (team, name, id, role, dateAdded, addedBy, confirmed) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    members.forEach(({ name, id, role }) => {
        let confirmed: number | null = null;
        if (id) confirmed = id === creator ? 1 : 0;
        contentDb.prepare(statement).run(team.id, name, id, role, timestamp, creator, confirmed);
    });

    return team.id;
}

export async function updateTeam(teamId: string, updates: Partial<Team>, members: { name: string, id: string | null, role: Role }[], addedBy: string): Promise<boolean> {
    const data = prepDataForDb(updates);
    const updateFields = Object.keys(data).map(key => `${key} = $${key}`).join(', ');
    if (updateFields) {
        contentDb.prepare(`
            UPDATE teams SET ${updateFields} WHERE id = $teamId
        `).run({ ...data, teamId });
    }

    const existingMembers = await getTeamMembers(teamId);
    const getExistingMember = (member: { name: string, id: string | null, role: Role }) => (
        existingMembers.find((existing) => (
            existing.role === member.role &&
            existing.id === member.id &&
            existing.name === member.name
        ))
    );

    contentDb.prepare('DELETE FROM team_members WHERE team = ?').run(teamId);

    const timestamp = new Date().toISOString();
    const statement = contentDb.prepare(`
        INSERT INTO team_members (team, name, id, role, dateAdded, addedBy, confirmed)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    members.forEach((member) => {
        const existingMember = getExistingMember(member);
        let confirmed: number | null = null;
        if (typeof existingMember?.confirmed === 'boolean') {
            confirmed = existingMember.confirmed ? 1 : 0;
        } else if (member.id) {
            confirmed = member.id === addedBy ? 1 : 0;
        }

        statement.run(
            teamId,
            member.name,
            member.id,
            member.role,
            existingMember?.dateAdded || timestamp,
            existingMember?.addedBy || addedBy,
            confirmed
        );
    });

    return true;
}

export async function updateTeamDetails(teamId: string, updates: Partial<Team>): Promise<boolean> {
    const data = prepDataForDb(updates);
    const updateFields = Object.keys(data).map(key => `${key} = $${key}`).join(', ');
    if (!updateFields) return true;

    contentDb.prepare(`
        UPDATE teams SET ${updateFields} WHERE id = $teamId
    `).run({ ...data, teamId });

    return true;
}

export async function leaveTeam(teamId: string, userId: string): Promise<{ deletedTeam: boolean }> {
    const confirmedMemberships = contentDb
        .prepare('SELECT * FROM team_members WHERE team = ? AND id = ? AND confirmed = 1')
        .all(teamId, userId) as { [key: string]: string | null }[];
    if (!confirmedMemberships.length) return { deletedTeam: false };

    contentDb.prepare('DELETE FROM team_members WHERE team = ? AND id = ?').run(teamId, userId);

    const deletedTeam = await deleteTeamIfNooneLeft(teamId);
    return { deletedTeam };
}

async function deleteTeamIfNooneLeft(teamId: string): Promise<boolean> {
    const remainingMembersWithIds = contentDb
        .prepare(`SELECT COUNT(*) AS total FROM team_members WHERE team = ? AND id IS NOT NULL AND id != ? AND role != 'coach'`)
        .get(teamId, '') as { total: number };
    if (remainingMembersWithIds.total > 0) {
        return false;
    }
    const team = await (getTeam(teamId));
    if (team) await destroyImage(team.image);
    contentDb.prepare('DELETE FROM team_members WHERE team = ?').run(teamId);
    contentDb.prepare('DELETE FROM teams WHERE id = ?').run(teamId);
    contentDb.prepare("DELETE FROM showing_cast WHERE role = 'team' AND id = ?").run(teamId);
    usersDb.prepare("DELETE FROM follows WHERE followId = ? AND type = 'team'").run(teamId);
    return true;
}
