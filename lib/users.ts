'use server';

import fs from 'node:fs';

import { User } from "@/types";
import { getRandomNumberString } from './helper-functions';

import sql from 'better-sqlite3';
const usersDb = sql('users.db');

function initDb() {
    usersDb.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            pronouns TEXT,
            headline TEXT,
            bio TEXT,
            theatre TEXT,
            secondaryTheatre TEXT,
            gender TEXT,
            orientation TEXT,
            ethnicity TEXT,
            website TEXT,
            experience TEXT,
            image TEXT,
            teams TEXT
        )
    `).run();
}
initDb();

export async function getUser(username: string) {
    return await usersDb.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

export async function saveUser(user: User, image?: File): Promise<string> {
    if (!user.username) {
        user.username = `${user.firstName.toLowerCase().trim()}-${getRandomNumberString(5)}`;
    }

    if (image && image.size) {
        const extension = image.name.split('.').pop();
        const fileName = `${user.username}.${extension}`;

        if (image.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('Image file size exceeds 5MB limit');
        }

        const stream = fs.createWriteStream(`public/temp-images/${fileName}`);
        const bufferedImage = await image.arrayBuffer();
        stream.write(Buffer.from(bufferedImage), (error) => {
            if (error) {
                throw new Error('Failed to save image');
            }
        });
        user.image = `/temp-images/${fileName}`;
    }

    usersDb.prepare(`
        INSERT INTO users (
            username,
            firstName,
            lastName,
            pronouns,
            headline,
            bio,
            theatre,
            secondaryTheatre,
            gender,
            orientation,
            ethnicity,
            website,
            experience,
            image,
            teams
        )
        VALUES (
            $username,
            $firstName,
            $lastName,
            $pronouns,
            $headline,
            $bio,
            $theatre,
            $secondaryTheatre,
            $gender,
            $orientation,
            $ethnicity,
            $website,
            $experience,
            $image,
            $teams
        )
    `).run(user);
    return user.username;
}