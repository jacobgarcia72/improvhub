/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Followee, User } from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { verifyAuth } from "./auth";
import { revalidatePath } from "next/cache";
import { toSnakeCase } from "./helper-functions";

const convertDataToUser = (data: {[key: string]: any}, includePassword = false): User => {
    return {
        id: data.id as string,
        password: includePassword ? data.password as string : undefined,
        joinDate: data.join_date as string,
        firstName: data.first_name as string,
        lastName: data.last_name as string,
        pronouns: data.pronouns || undefined,
        headline: data.headline || undefined,
        bio: data.bio || undefined,
        theatres: data.theatres ? data.theatres.split(',') : undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        website: data.website || undefined,
        image: data.image || undefined,
    }
}

const snakeCaseObject = (data: { [key: string]: any }) => {
    return Object.keys(data).reduce((result: { [key: string]: any }, key) => {
        result[toSnakeCase(key)] = data[key];
        return result;
    }, {} as { [key: string]: any });
};

export async function getUser(username: string, includePassword = false): Promise<User | null> {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', username)
        .maybeSingle();
    if (error) throw error;
    return data ? convertDataToUser(data, includePassword) : null;
}

export async function getUserName(username: string): Promise<string | null> {
    const user = await getUser(username);
    if (user) return `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`;
    return null;
}

export async function getAllUsers(): Promise<{ name: string, id: string, image?: string }[]> {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('first_name, last_name, id, image');
    if (error) throw error;
    return (data || []).map((user: any) => ({
        name: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`,
        id: user.id,
        image: user.image || undefined
    }));
}

export async function getCurrentUser(): Promise<User | null> {
    const user = (await verifyAuth()).user;
    if (!user) return null;
    return getUser(user.id);
}

export async function updateUser(userId: string, updates: {[key: string]: string | null}): Promise<void> {
    const { error } = await supabaseAdmin
        .from('users')
        .update(snakeCaseObject(updates))
        .eq('id', userId);
    if (error) throw error;
}

export async function getFollowing(userId: string, followId: string, type: Followee): Promise<boolean | null> {
    const { data, error } = await supabaseAdmin
        .from('follows')
        .select('following')
        .eq('user_id', userId)
        .eq('follow_id', followId)
        .eq('type', type)
        .maybeSingle();
    if (error) throw error;
    if (!data || typeof data.following !== 'number') return null;
    return Boolean(data.following);
}

export async function getFollowerCount(followId: string, type: Followee): Promise<number | null> {
    const { count, error } = await supabaseAdmin
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follow_id', followId)
        .eq('type', type);
    if (error) throw error;
    return count ?? 0;
}

export async function setFollowing(userId: string, followId: string, type: Followee): Promise<void> {
    const currentFollowStatus = await getFollowing(userId, followId, type);
    if (currentFollowStatus === null) {
        const { error } = await supabaseAdmin
            .from('follows')
            .insert({ user_id: userId, follow_id: followId, type, following: 1 });
        if (error) throw error;
    } else {
        const { error } = await supabaseAdmin
            .from('follows')
            .update({ following: currentFollowStatus ? 0 : 1 })
            .eq('user_id', userId)
            .eq('follow_id', followId)
            .eq('type', type);
        if (error) throw error;
    }
    if (type === 'team') revalidatePath(`/teams/${followId}`, 'layout');
}

export async function saveUser(user: User): Promise<void> {
    const { error } = await supabaseAdmin
        .from('users')
        .insert({
            id: user.id,
            password: user.password,
            join_date: user.joinDate,
            first_name: user.firstName,
            last_name: user.lastName,
            pronouns: user.pronouns,
            headline: user.headline,
            bio: user.bio,
            theatres: user.theatres?.join(',') || null,
            city: user.city,
            state: user.state,
            website: user.website,
            image: user.image,
        });
    if (error) throw error;
}