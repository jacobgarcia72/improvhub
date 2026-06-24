'use server';

import { saveTopic } from "@/lib/chat";
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