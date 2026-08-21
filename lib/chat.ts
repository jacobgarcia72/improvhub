'use server';

import { Comment, DiscussionPost, InputOptionObject, Topic } from '@/types';
import { getTroupeMembers, getTroupesByUser } from './troupes';
import { getTheatre } from './theatres';
import { getUser } from './users';
import { supabaseAdmin } from './supabase-server';
import slugify from 'slugify';
import { camelCaseObject, capitalize, getRandomNumberString, snakeCaseObject } from './helper-functions';
import { revalidatePath } from 'next/cache';
import { postNotification } from './notifications';

export async function getChatRooms(userId: string): Promise<{
    theatres: InputOptionObject[],
    troupes: InputOptionObject[],
    city?: InputOptionObject
}> {
    const user = await getUser(userId);
    // const theatreStrings = user?.theatres || [];
    // const theatres = (await Promise.all(theatreStrings.map(getTheatre))).filter((t) => t !== null);
    // const theatreChatRooms = theatres.map(({ id, name, image }) => ({ id: `theatre-${id}`, text: name, image }));
    const city = user?.city;
    const state = user?.state;
    const cityChatRoom = (city && state) ? { id: `city-${slugify(`${city} ${state}`, { lower: true, trim: true, strict: true })}`, text: `${capitalize(city)} ${state.toUpperCase()}` } : undefined;
    const troupes = await getTroupesByUser(userId);
    const troupeChatRooms = troupes.map(({ id, name, image }) => ({ id: `troupe-${id}`, text: name, image: image || undefined }));
    return ({
        theatres: [], //theatreChatRooms,
        troupes: troupeChatRooms,
        city: cityChatRoom
    });
}

export async function getTopic(room: string, topic: string): Promise<Topic | null> {
    if (topic === 'general') return ({ room, title: 'General', id: 'general', description: null });
    const { data } = await supabaseAdmin
        .from('topics')
        .select('*')
        .eq('room', room)
        .eq('id', topic)
        .maybeSingle();
    return data ? camelCaseObject(data) as Topic : null;
}

export async function getTopics(room: string): Promise<Topic[]> {
    const { data } = await supabaseAdmin
        .from('topics')
        .select('*')
        .eq('room', room);
    const generalTopic: Topic = { room, title: 'General', id: 'general', description: null };
    if (room === 'general' && !data?.length) {

    }
    return [...(data || []).map(camelCaseObject), generalTopic];
}

export async function getPosts(room: string, topicId: string): Promise<DiscussionPost[]> {
    const { data } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('room', room)
        .eq('topic_id', topicId)
        .order('date', { ascending: false });
    return [...(data || []).map(camelCaseObject)];
}
export async function getPost(postId: string): Promise<DiscussionPost | null> {
    const { data } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle();
    return data ? camelCaseObject(data) as DiscussionPost : null;
}

export async function getLatestPost(room: string, topicId: string): Promise<DiscussionPost | null> {
    const { data } = await supabaseAdmin
        .from('posts')
        .select('*')
        .eq('room', room)
        .eq('topic_id', topicId)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle();
    return data ? camelCaseObject(data) as DiscussionPost : null;
}

export async function getComments(room: string, topicId: string, postId: string): Promise<Comment[]> {
    const { data } = await supabaseAdmin
        .from('comments')
        .select('*')
        .eq('room', room)
        .eq('post_id', postId)
        .eq('topic_id', topicId);
    return [...(data || []).map(camelCaseObject)];
}

export async function getActivityTotal(room: string, topicId: string): Promise<number> {
    const { data } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('room', room)
        .eq('topic_id', topicId);
    const postCount = data?.length || 0;
    const commentCount = (await Promise.all((data || []).map(async (row: { id: string; }) => await getComments(room, topicId, row.id)))).length;
    return postCount + commentCount;
}

export async function saveTopic(userId: string, room: string, topic: string, description: string | null): Promise<{ success: boolean, message: string, id: string }> {
    const id = slugify(topic, { lower: true, trim: true, strict: true });
    const topicExists = Boolean(await getTopic(room, id));
    if (topicExists) return { success: false, message: 'Topic already exists', id };
    const newTopic: Topic = {
        room,
        title: topic,
        description,
        id,
        creator: userId,
        date: new Date().toISOString()
    }
    try {
        const { error } = await supabaseAdmin
            .from('topics')
            .insert(newTopic);
        if (error) throw (error);
        return { success: true, message: 'Success', id };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Something went wrong', id };
    }
}

export async function savePost(userId: string, room: string, topicId: string, post: string): Promise<{ success: boolean, message: string, id: string }> {
    const id = `${new Date().getTime()}${getRandomNumberString(5)}`;
    const newPost: DiscussionPost = {
        room,
        topicId,
        post,
        id,
        creator: userId,
        date: new Date().toISOString()
    }
    try {
        const { error } = await supabaseAdmin
            .from('posts')
            .insert(snakeCaseObject(newPost));
        if (error) throw (error);
        if (room.startsWith('troupe')) {
            const troupeId = room.replace('troupe-', '');
            const members = await getTroupeMembers(troupeId, false);
            const userToNotify = members.map((m) => m.id).filter((memberId) => (memberId !== userId)).filter((memberId) => memberId !== null);
            if (userToNotify.length) postNotification(userId, userToNotify, 'new_post_in_troupe_channel', `${room},${topicId},${id}`);
        }
        return { success: true, message: 'Success', id };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Something went wrong', id };
    }
}

export async function saveComment(userId: string, room: string, topicId: string, postId: string, comment: string): Promise<{ success: boolean, message: string, id: string }> {
    const id = `${new Date().getTime()}${getRandomNumberString(6)}`;
    const newComment: Comment = {
        room,
        topicId,
        postId,
        comment,
        id,
        creator: userId,
        date: new Date().toISOString()
    }
    try {
        const { error } = await supabaseAdmin
            .from('comments')
            .insert(snakeCaseObject(newComment));
        if (error) throw (error);
        const postCreator = (await getPost(postId))?.creator;
        if (postCreator && postCreator !== userId) {
            postNotification(userId, [postCreator], 'new_comment', `${room},${topicId},${postId}`);
        }
        return { success: true, message: 'Success', id };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Something went wrong', id };
    }
}

export const deletePost = async (postId: string) => {
    await supabaseAdmin
        .from('posts')
        .delete()
        .eq('id', postId);
    await supabaseAdmin
        .from('comments')
        .delete()
        .eq('post_id', postId);
    revalidatePath('/discuss');
}

export const deleteComment = async (commentId: string, postId: string) => {
    await supabaseAdmin
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('post_id', postId);
    revalidatePath('/discuss');
}