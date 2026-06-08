/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Followee, User } from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { verifyAuth } from "./auth";
import { revalidatePath } from "next/cache";
import { camelCaseObject, snakeCaseObject } from "./helper-functions";
import { destroyImage } from "./cloudinary";

export async function getUser(username: string, includePassword = false): Promise<User | null> {
    const { data } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', username)
        .maybeSingle();
    return data ? camelCaseObject({
        ...data,
        password: includePassword ? data.password as string : '',
    }) as User : null;
}

export async function getUserRoles(userId: string): Promise<{ [role: string]: boolean } | null> {
    const { data, error } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
        player: Boolean(data.player),
        tech: Boolean(data.tech),
        director: Boolean(data.director),
        musician: Boolean(data.musician),
        coach: Boolean(data.coach),
    };
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

export async function updateUser(updates: { [key: string]: any }, userRoles?: { [role: string]: boolean }): Promise<void> {
    const user = (await verifyAuth()).user;
    if (!user) return;
    let oldImage = '';
    if (updates.image && user.image) oldImage = user.image;
    const { error } = await supabaseAdmin
        .from('users')
        .update(snakeCaseObject(updates))
        .eq('id', user.id);
    if (error) throw error;
    if (oldImage) destroyImage(oldImage);
    if (userRoles) {
        const { error: roleDeleteError } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', user.id);
        if (roleDeleteError) throw roleDeleteError;
        const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({ ...userRoles, user_id: user.id });
        if (roleError) throw roleError;
    }
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
            .insert({ user_id: userId, follow_id: followId, type, following: true });
        if (error) throw error;
    } else {
        const { error } = await supabaseAdmin
            .from('follows')
            .update({ following: !currentFollowStatus })
            .eq('user_id', userId)
            .eq('follow_id', followId)
            .eq('type', type);
        if (error) throw error;
    }
    if (type === 'team') revalidatePath(`/teams/${followId}`, 'layout');
}

export async function saveUser(user: User, userRoles?: { [role: string]: boolean }): Promise<void> {
    const { error } = await supabaseAdmin
        .from('users')
        .insert({
            id: user.id,
            password: user.password,
            join_date: user.joinDate,
            first_name: user.firstName,
            last_name: user.lastName,
            pronouns: user.pronouns,
            bio: user.bio,
            theatres: user.theatres,
            city: user.city,
            state: user.state,
            website: user.website,
            image: user.image,
        });
    if (error) throw error;
    if (userRoles) {
        const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ ...userRoles, user_id: user.id });
        if (roleError) throw roleError;
    }
}