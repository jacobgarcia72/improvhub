'use server';

import { User } from "@/types";
import { usersDb } from "./db";
import { verifyAuth } from "./auth";

export async function getUser(username: string): Promise<User | null> {
    return (await usersDb.prepare('SELECT * FROM users WHERE id = ?').get(username) || null) as User | null;
}

export async function getUserName(username: string): Promise<string | null> {
    const user = await getUser(username);
    if (user) return `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;
    return null;
}

export async function getAllUsers(): Promise<{ name: string, id: string, image?: string }[]> {
    return usersDb
        .prepare(`SELECT (firstName || ' ' || lastName) AS name, id, image FROM users`).all() as { name: string, id: string, image?: string }[];
}

export async function getCurrentUser(): Promise<User | null> {
    const user = (await verifyAuth()).user;
    if (user) {
        return (await usersDb.prepare('SELECT * FROM users WHERE id = ?').get(user.id) || null) as User | null;
    }
    return null;
}

export async function updateUser(userId: string, updates: {[key: string]: string | null}): Promise<void> {
    const updateFields = Object.keys(updates).map(key => `${key} = $${key}`).join(', ');
    usersDb.prepare(`
        UPDATE users SET ${updateFields} WHERE id = $id
    `).run({ ...updates, id: userId });
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
            image
        )
        VALUES (
            $id,
            $password,
            $joinDate,
            $firstName,
            $lastName,
            $pronouns,
            $image
        )
    `).run(user);
}