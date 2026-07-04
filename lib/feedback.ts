import { camelCaseObject } from "./helper-functions";
import { supabaseAdmin } from "./supabase-server";

export async function getFeedback(): Promise<{ id: string, userId: string, feedback: string, date: string }[]> {
    const { data } = await supabaseAdmin
        .from('feedback')
        .select('*')
        .order('date', { ascending: false })
    return data.map(camelCaseObject);
}

export async function saveFeedback(userId: string, feedback: string): Promise<{ success: boolean, message: string }> {
    try {
        const { error } = await supabaseAdmin
            .from('feedback')
            .insert({
                user_id: userId,
                feedback,
                date: new Date().toISOString()
            });
        if (error) throw (error);
        return { success: true, message: 'Success' };
    } catch (error) {
        console.error(error);
        return { success: false, message: 'Something went wrong' };
    }
}