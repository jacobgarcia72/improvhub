/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { AbbrevUser, Followee, Friendship, User } from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { destroySession, verifyAuth } from "./auth";
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

export async function getUserAbbreviated(username: string): Promise<AbbrevUser | null> {
    const { data: user } = await supabaseAdmin
        .from('users')
        .select('first_name, last_name, id, image')
        .eq('id', username)
        .maybeSingle();
    return user ? {
        name: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ''}`,
        id: user.id,
        image: user.image || undefined
    } : null;
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

export async function getAllUsers(): Promise<User[]> {
    const { data, error } = await supabaseAdmin
        .from('users')
        .select('*');
    if (error) throw error;
    return (data || []).map((row: { [key: string]: any; }) => camelCaseObject({
        ...row,
        password: '',
    })) as User[];
}

export async function getAllUsersAbbreviated(): Promise<AbbrevUser[]> {
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

export async function searchUsers(searchCriteria: Partial<User>): Promise<User[]> {
    const { data } = await supabaseAdmin
    .from('users')
    .select('*')
    .match(snakeCaseObject(searchCriteria));
    return (data || []).map((row: { [key: string]: any; }) => camelCaseObject({
        ...row,
        password: '',
    })) as User[];
}

export async function getCurrentUser(): Promise<User | null> {
    const user = (await verifyAuth()).user;
    if (!user) return null;
    return getUser(user.id);
}

export async function getCurrentUserId(): Promise<string | null> {
    const user = (await verifyAuth()).user;
    if (!user) return null;
    return user.id;
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
        const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .upsert({ ...userRoles, user_id: user.id }, { onConflict: 'user_id' });
        if (roleError) throw roleError;
    }
}

export async function getFollowing(userId: string, followId: string, type: Followee): Promise<boolean> {
    const { data, error } = await supabaseAdmin
        .from('follows')
        .select('following')
        .eq('user_id', userId)
        .eq('follow_id', followId)
        .eq('type', type)
        .limit(1)
        .maybeSingle();
    if (error) throw error;
    return Boolean(data?.following);
}

export async function getFollows(followId: string, type: Followee): Promise<{ name: string, id: string, image?: string }[]> {
    const { data: followerData } = await supabaseAdmin
        .from('follows')
        .select('user_id')
        .eq('following', true)
        .eq('follow_id', followId)
        .eq('type', type);
    if (!followerData) return [];
    const userIds = followerData.map((row: { user_id: any; }) => row.user_id)
    const { data } = await supabaseAdmin
        .from('users')
        .select('first_name, last_name, id, image')
        .in('id', userIds);
    return data ? data.map((row: { first_name: string; last_name: string; id: string; image?: string }) => ({ name: `${row.first_name} ${row.last_name}`, id: row.id, image: row.image })) : [];
}

export async function getFollowees(userId: string, type: Followee): Promise<{ name: string, id: string, image?: string }[]> {
    const { data: followeeData } = await supabaseAdmin
        .from('follows')
        .select('follow_id')
        .eq('following', true)
        .eq('user_id', userId)
        .eq('type', type);
    if (!followeeData) return [];
    const ids = followeeData.map((row: { follow_id: any; }) => row.follow_id)
    switch (type) {
        case 'team':
            return (await supabaseAdmin
                .from(`teams`)
                .select(`name, id, image`)
                .in('id', ids))?.data || [];
        case 'theatre':
            return (await supabaseAdmin
                .from(`theatres`)
                .select(`name, id, image`)
                .in('id', ids))?.data || [];
        default:
            return [];
    }
}

export async function getFollowCount(id: string, type: Followee, getFollowees = false): Promise<number | null> {
    const { count, error } = await supabaseAdmin
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq(getFollowees ? 'user_id' : 'follow_id', id)
        .eq('type', type);
    if (error) throw error;
    return count ?? 0;
}

export async function setFollowing(userId: string, followId: string, type: Followee, following: boolean): Promise<void> {
    const { error } = await supabaseAdmin
        .from('follows')
        .upsert(
            { user_id: userId, follow_id: followId, following, type },
            { onConflict: 'user_id, follow_id, type' }
        );
    if (error) throw error;
    if (type === 'team') revalidatePath(`/teams/${followId}`, 'layout');
    if (type === 'theatre') revalidatePath(`/theatres/${followId}`, 'layout');
}

export async function createFriendRequest(senderId: string, receiverId: string): Promise<void> {
    const { error } = await supabaseAdmin
        .from('friendships')
        .insert(
            { user1_id: senderId, user2_id: receiverId, accepted: false }
        );
    if (error) throw error;
    revalidatePath(`/profile/${receiverId}`, 'layout');
    revalidatePath(`/search`, 'layout');
}

export async function acceptFriendRequest(senderId: string, receiverId: string): Promise<void> {
    const { error } = await supabaseAdmin
        .from('friendships')
        .update({ 'accepted': true })
        .eq('user1_id', senderId)
        .eq('user2_id', receiverId)
    if (error) throw error;
    revalidatePath(`/profile/${senderId}`, 'layout');
    revalidatePath(`/profile/${receiverId}`, 'layout');
    revalidatePath(`/search`, 'layout');
}

export async function deleteFriendRequest(senderId: string, receiverId: string): Promise<void> {
    const { error } = await supabaseAdmin
        .from('friendships')
        .delete()
        .eq('user1_id', senderId)
        .eq('user2_id', receiverId)
    if (error) throw error;
    revalidatePath(`/profile/${senderId}`, 'layout');
    revalidatePath(`/profile/${receiverId}`, 'layout');
    revalidatePath(`/search`, 'layout');
}

export async function unfriend(yourId: string, theirId: string): Promise<void> {
    const { error } = await supabaseAdmin
        .from('friendships')
        .delete()
        .or(`and(user1_id.eq.${yourId},user2_id.eq.${theirId}),and(user1_id.eq.${theirId},user2_id.eq.${yourId})`)
    if (error) throw error;
    revalidatePath(`/profile/${yourId}`, 'layout');
    revalidatePath(`/profile/${theirId}`, 'layout');
    revalidatePath(`/search`, 'layout');
}

export async function getFriendship(yourId: string, theirId: string): Promise<Friendship | null> {
    const { data } = await supabaseAdmin
        .from('friendships')
        .select('*')
        .or(`and(user1_id.eq.${yourId},user2_id.eq.${theirId}),and(user1_id.eq.${theirId},user2_id.eq.${yourId})`)
        .maybeSingle();
    return data ? camelCaseObject(data) as Friendship : null;
}
export async function getFriendCount(userId: string): Promise<number> {
    const { count } = await supabaseAdmin
        .from('friendships')
        .select('*', { count: 'exact', head: true })
        .eq('accepted', true)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
    return count ?? 0;
}

export async function getFriends(userId: string): Promise<AbbrevUser[]> {
    const { data } = await supabaseAdmin
        .from('friendships')
        .select('user1_id,user2_id')
        .eq('accepted', true)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
    if (!data) return [];
    const res: AbbrevUser[] = [];
    for (let i = 0; i < data.length; i++) {
        const { user1_id: user1Id, user2_id: user2Id } = data[i];
        const friendId = userId === user1Id ? user2Id : user1Id;
        const friend = await getUserAbbreviated(friendId);
        if (friend) res.push(friend);
    }
    return res;
}

export async function getFriendIds(userId: string): Promise<string[]> {
    const { data } = await supabaseAdmin
        .from('friendships')
        .select('user1_id,user2_id')
        .eq('accepted', true)
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`);
    if (!data) return [];
    const res: string[] = [];
    for (let i = 0; i < data.length; i++) {
        const { user1_id: user1Id, user2_id: user2Id } = data[i];
        const friendId = userId === user1Id ? user2Id : user1Id;
        if (friendId) res.push(friendId);
    }
    return res;
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
            open_to_join_team: user.openToJoinTeam,
            open_to_accompany_team: user.openToAccompanyTeam,
            open_to_coach_team: user.openToJoinTeam
        });
    if (error) throw error;
    if (userRoles) {
        const { error: roleError } = await supabaseAdmin
        .from('user_roles')
        .insert({ ...userRoles, user_id: user.id });
        if (roleError) throw roleError;
    }
}

export async function updatePassword(userId: string, newPassword: string): Promise<boolean> {
    const { error } = await supabaseAdmin
        .from('users')
        .update({ password: newPassword })
        .eq('id', userId);
    if (error) throw error;
    return true;
}

export async function deleteUser(user: User): Promise<void> {
    if (user.image) {
        await destroyImage(user.image);
    }
    await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', user.id);
    await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);
    await destroySession();
}
