'use server';

import { Team } from "@/types";
import { contentDb } from './db';

export async function getTeam(id: string): Promise<Team> {
    return await contentDb.prepare('SELECT * FROM shows WHERE id = ?').get(id) as Team;
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