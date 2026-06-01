'use server';

import { Team, TeamMember, TeamMemberRole } from "@/types";
import { contentDb } from './db';

const convertDataToTeam = (data: {[key: string]: string | null}): Team => {
    return {
        id: data.id || '',
        admins: data.admins?.split(',') || [],
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
        role: data.role as TeamMemberRole,
        dateAdded: data.dateAdded as string,
        addedBy: data.addedBy as string,
        confirmed
    }
}

export async function getTeam(id: string): Promise<Team | null> {
    const data = await contentDb.prepare('SELECT * FROM teams WHERE id = ?').get(id) as {[key: string]: string | null};
    return data ? convertDataToTeam(data) : null;
}

export async function getTeamsByUser(id: string): Promise<Team[]> {
    const teamMemberships = contentDb.prepare('SELECT team FROM team_members WHERE name = ?').all(id) as { team: string }[];
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

export async function respondToTeamInvitation(teamId: string, userId: string, accept: boolean): Promise<void> {
    if (accept) {
        contentDb.prepare('UPDATE team_members SET confirmed = 1 WHERE team = ? AND id = ?').run(teamId, userId);
    } else {
        contentDb.prepare('DELETE FROM team_members WHERE team = ? AND id = ?').run(teamId, userId);
    }
}

export async function saveTeam(team: Team, members: { name: string, id: string | null, role: TeamMemberRole }[]): Promise<string> {
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
            admins,
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
        team.admins,
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

    const creator = team.admins[0];

    const timestamp = new Date().toISOString();
    const statement = `INSERT INTO team_members (team, name, id, role, dateAdded, addedBy, confirmed) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    members.forEach(({ name, id, role }) => {
        let confirmed: number | null = null;
        if (id) confirmed = id === creator ? 1 : 0;
        contentDb.prepare(statement).run(team.id, name, id, role, timestamp, creator, confirmed);
    });

    return team.id;
}