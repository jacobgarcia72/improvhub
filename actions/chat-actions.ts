'use server';

import { savePost, saveTopic, saveComment } from "@/lib/chat";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function postTopic(userId: string, roomId: string, prevState: void | { message?: string }, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const topic = (data.topic as string ).trim();
    if (!topic) return { message: 'Enter a topic' };
    const description = (data.description as string ).trim().replaceAll(/\r\n/g, '<br>').replaceAll(/\n/g, '<br>').replaceAll(/\r/g, '<br>');
    const { success, id, message } = await saveTopic(userId, roomId, topic, description || null);
    if (success) {
        revalidatePath(`/chat`, 'layout');
        redirect(`/chat?room=${roomId}&topic=${id}`);
    } else {
        return { message }
    }
}

export async function postPost(userId: string, roomId: string, topicId: string, prevState: void | { message?: string }, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const post = (data.post as string ).trim().replaceAll(/\r\n/g, '<br>').replaceAll(/\n/g, '<br>').replaceAll(/\r/g, '<br>');
    if (!post) return { message: 'Enter a post' };
    const { success, message } = await savePost(userId, roomId, topicId, post);
    if (success) {
        revalidatePath(`/chat`, 'layout');
        redirect(`/chat?room=${roomId}&topic=${topicId}`);
    } else {
        return { message }
    }
}

export async function postComment(userId: string, roomId: string, topicId: string, postId: string, prevState: void | { message?: string }, formData: FormData) {
    const data = Object.fromEntries(formData.entries());
    const comment = (data.comment as string ).trim().replaceAll(/\r\n/g, '<br>').replaceAll(/\n/g, '<br>').replaceAll(/\r/g, '<br>');
    if (!comment) return { message: 'Enter a comment' };
    const { success, message } = await saveComment(userId, roomId, topicId, postId, comment);
    if (success) {
        revalidatePath(`/chat`, 'layout');
    } else {
        return { message }
    }
}