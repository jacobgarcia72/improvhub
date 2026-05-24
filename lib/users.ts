'use server';

import { User } from "@/types";
import { usersDb } from "./db";
import { verifyAuth } from "./auth";

export async function getUser(username: string): Promise<User | null> {
    return (await usersDb.prepare('SELECT * FROM users WHERE id = ?').get(username) || null) as User | null;
}

export async function getCurrentUser(): Promise<User | null> {
    const user = (await verifyAuth()).user;
    if (user) {
        return (await usersDb.prepare('SELECT * FROM users WHERE id = ?').get(user.id) || null) as User | null;
    }
    return null;
}

export async function saveUser(user: User): Promise<void> {
    usersDb.prepare(`
        INSERT INTO users (
            id,
            password,
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
            $id,
            $password,
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
}