'use server';

import { Team } from "@/types";
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
        unconfirmedPlayers: data.unconfirmedPlayers?.split(',') || [],
        lookingForPlayers: Boolean(data.lookingForPlayers),
        coach: data.coach || null,
        unconfirmedCoach: data.unconfirmedCoach || null,
        lookingForCoach: Boolean(data.lookingForCoach),
        musician: data.musician || null,
        unconfirmedMusician: data.unconfirmedMusician || null,
        lookingForMusician: Boolean(data.lookingForMusician),
        description: data.description || null
    }
}

export async function getTeam(id: string): Promise<Team | null> {
    const data = await contentDb.prepare('SELECT * FROM teams WHERE id = ?').get(id) as {[key: string]: string | null};
    return data ? convertDataToTeam(data) : null;
}

export async function saveTeam(team: Team): Promise<string> {
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
            unconfirmedPlayers,
            lookingForPlayers,
            coach,
            unconfirmedCoach,
            lookingForCoach,
            musician,
            unconfirmedMusician,
            lookingForMusician,
            description
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        team.unconfirmedPlayers?.join(',') || null,
        team.lookingForPlayers ? 1 : 0,
        team.coach,
        team.unconfirmedCoach,
        team.lookingForCoach ? 1 : 0,
        team.musician,
        team.unconfirmedMusician,
        team.lookingForMusician ? 1 : 0,
        team.description,
    );

    return team.id;
}