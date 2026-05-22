'use server';

import { User } from "@/types";
import { getRandomNumberString } from './helper-functions';

import sql from 'better-sqlite3';
import { uploadImage } from './cloudinary';
const usersDb = sql('users.db');

function initDb() {
    usersDb.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            joinDate TEXT NOT NULL,
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
        if (image.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('Image file size exceeds 5MB limit');
        }
        let imageUrl = '';
        try {
            imageUrl = await uploadImage(image, 'users');
        } catch {
            throw new Error('Image upload failed');
        }
        user.image = imageUrl;
    }

    usersDb.prepare(`
        INSERT INTO users (
            username,
            joinDate,
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
            $joinDate,
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