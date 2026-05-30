'use server';

import { Team, TeamInvitation } from "@/types";
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
        players: data.players?.split(',') || [],
        lookingForPlayers: Boolean(data.lookingForPlayers),
        coach: data.coach || null,
        lookingForCoach: Boolean(data.lookingForCoach),
        musician: data.musician || null,
        lookingForMusician: Boolean(data.lookingForMusician),
        description: data.description || null
    }
}

export async function getTeam(id: string): Promise<Team | null> {
    const data = await contentDb.prepare('SELECT * FROM teams WHERE id = ?').get(id) as {[key: string]: string | null};
    return data ? convertDataToTeam(data) : null;
}

export async function getTeamsByUser(id: string): Promise<Team[]> {
    const data = contentDb.prepare(
        `SELECT * FROM teams WHERE ',' || players || ',' LIKE ?`
    ).all(`%,${id},%`) as {[key: string]: string | null}[];
    return data.map(convertDataToTeam);
}

export async function getTeamInvitationsByTeam(id: string): Promise<TeamInvitation[]> {
    return contentDb.prepare(
        `SELECT * FROM team_invitations WHERE team_id = ?`
    ).all(id) as TeamInvitation[];
}

export async function saveTeam(team: Team, invitations?: {
    players: string[] | null,
    coach: string | null,
    musician: string | null
}): Promise<string> {
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
            players,
            lookingForPlayers,
            coach,
            lookingForCoach,
            musician,
            lookingForMusician,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        team.id,
        team.admins,
        team.name,
        team.image,
        team.photoCredit,
        team.city,
        team.state,
        team.theatres?.join(',') || null,
        team.players?.join(',') || null,
        team.lookingForPlayers ? 1 : 0,
        team.coach,
        team.lookingForCoach ? 1 : 0,
        team.musician,
        team.lookingForMusician ? 1 : 0,
        team.description,
    );

    if (invitations) {
        const { players, coach, musician } = invitations;
        const timestamp = new Date().toISOString();
        const statement = `INSERT INTO team_invitations (
            team_id, invited, invitee, role, timestamp
            ) VALUES (?, ?, ?, ?, ?)`;
        players?.forEach((player) => {
            contentDb.prepare(statement).run(team.id, player, team.admins[0], 'player', timestamp);
        });
        if (coach) {
            contentDb.prepare(statement).run(team.id, coach, team.admins[0], 'coach', timestamp);
        }
        if (musician) {
            contentDb.prepare(statement).run(team.id, musician, team.admins[0], 'musician', timestamp);
        }
    }

    return team.id;
}