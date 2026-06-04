'use server';

import { Followee, User } from "@/types";
import { usersDb } from "./db";
import { verifyAuth } from "./auth";
import { revalidatePath } from "next/cache";

const convertDataToUser = (data: {[key: string]: string | null}, includePassword = false): User => {
    return {
        id: data.id as string,
        password: includePassword ? data.password as string : undefined,
        joinDate: data.joinDate as string,
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        pronouns: data.pronouns || undefined,
        headline: data.headline || undefined,
        bio: data.bio || undefined,
        theatres: data.theatres ? data.theatres.split(',') : undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        gender: data.gender || undefined,
        orientation: data.orientation || undefined,
        ethnicity: data.ethnicity || undefined,
        website: data.website || undefined,
        experience: data.experience || undefined,
        image: data.image || undefined,
    }
}

export async function getUser(username: string, includePassword = false): Promise<User | null> {
    const user = await usersDb.prepare('SELECT * FROM users WHERE id = ?').get(username) as {[key: string]: string | null};
    return user ? convertDataToUser(user, includePassword) : null;
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
    let userData: {[key: string]: string | null} | null = null;
    if (user) {
        userData = await usersDb.prepare('SELECT * FROM users WHERE id = ?').get(user.id) as {[key: string]: string | null} || null;
    }
    return userData ? convertDataToUser(userData) : null;
}

export async function updateUser(userId: string, updates: {[key: string]: string | null}): Promise<void> {
    const updateFields = Object.keys(updates).map(key => `${key} = $${key}`).join(', ');
    usersDb.prepare(`
        UPDATE users SET ${updateFields} WHERE id = $id
    `).run({ ...updates, id: userId });
}

export async function getFollowing(userId: string, followId: string, type: Followee): Promise<boolean | null> {
    const currentFollowStatus = usersDb
        .prepare(`SELECT following FROM follows WHERE userId = ? AND followId = ? AND type = ?`)
        .get(userId, followId, type) as {following: number | undefined}
    const following = currentFollowStatus.following
    return typeof following === 'number' ? Boolean(following) : null;
}

export async function setFollowing(userId: string, followId: string, type: Followee): Promise<void> {
    const currentFollowStatus = await getFollowing(userId, followId, type);
    let statement = '';
    if (currentFollowStatus === null) {
        statement = `INSERT INTO follows (userId, followId, type, following) 
            VALUES ($userId, $followId, $type, $following)`
    } else {
        statement = `UPDATE follows SET following = $following
            WHERE userId = $userId AND followId = $followId AND type = $type`
    }
    usersDb.prepare(statement).run({userId, followId, type, following: currentFollowStatus ? 0 : 1});
    if (type === 'team') revalidatePath (`/teams/${followId}`, 'layout');
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