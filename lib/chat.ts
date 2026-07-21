'use server';

import { Comment, DiscussionPost, InputOptionObject, Topic } from '@/types';
import { getTroupesByUser } from './troupes';
import { getTheatre } from './theatres';
import { getUser } from './users';
import { supabaseAdmin } from './supabase-server';
import slugify from 'slugify';
import { camelCaseObject, getRandomNumberString, snakeCaseObject } from './helper-functions';

export async function getChatRooms(userId: string): Promise<{
    theatres: InputOptionObject[],
    troupes: InputOptionObject[]
}> {
    const theatreStrings = (await getUser(userId))?.theatres || [];
    const theatres = (await Promise.all(theatreStrings.map(getTheatre))).filter((t) => t !== null);
    const theatreChatRooms = theatres.map(({ id, name, image }) => ({ id: `theatre-${id}`, text: name, image }));
    const troupes = await getTroupesByUser(userId);
    const troupeChatRooms = troupes.map(({ id, name, image }) => ({ id: `troupe-${id}`, text: name, image: image || undefined }));
    return ({
        theatres: theatreChatRooms,
        troupes: troupeChatRooms
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

export async function getComments(room: string, topicId: string, postId: string): Promise<Comment[]> {
    const { data } = await supabaseAdmin
        .from('comments')
        .select('*')
        .eq('room', room)
        .eq('post_id', postId)
        .eq('topic_id', topicId);
    return [...(data || []).map(camelCaseObject)];
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
        return { success: true, message: 'Success', id };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Something went wrong', id };
    }
}