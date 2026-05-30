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
        coaches: data.coaches?.split(',') || [],
        lookingForCoach: Boolean(data.lookingForCoach),
        musicians: data.musicians?.split(',') || [],
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

export async function getTeamInvitations(params: {
    team?: string,
    invited?: string,
    invitee?: string
}): Promise<TeamInvitation[]> {
    let query = `SELECT * FROM team_invitations`;
    if (Object.keys(params)) {
        query += ' WHERE ';
        const queries = Object.keys(params).map(param => `${param} = ?`);
        query += (queries.join(' OR '));
    }
    return contentDb.prepare(query).all(...Object.values(params)) as TeamInvitation[];
}

export async function saveTeam(team: Team, invitations?: {
    players: string[] | null,
    coaches: string[],
    musicians: string[]
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
            coaches,
            lookingForCoach,
            musicians,
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
        team.coaches?.join(',') || null,
        team.lookingForCoach ? 1 : 0,
        team.musicians?.join(',') || null,
        team.lookingForMusician ? 1 : 0,
        team.description,
    );

    if (invitations) {
        const { players, coaches, musicians } = invitations;
        const timestamp = new Date().toISOString();
        const statement = `INSERT INTO team_invitations (
            team, invited, invitee, role, timestamp
            ) VALUES (?, ?, ?, ?, ?)`;
        players?.forEach((player) => {
            contentDb.prepare(statement).run(team.id, player, team.admins[0], 'player', timestamp);
        });
        coaches?.forEach((coach) => {
            contentDb.prepare(statement).run(team.id, coach, team.admins[0], 'coach', timestamp);
        });
        musicians?.forEach((musician) => {
            contentDb.prepare(statement).run(team.id, musician, team.admins[0], 'musician', timestamp);
        });
    }

    return team.id;
}