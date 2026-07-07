import { Notification, NotificationType } from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { camelCaseObject, snakeCaseObject } from "./helper-functions";

export const getNotifications = async (userId: string): Promise<Notification[]> => {
    const { data } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .contains('recipients', [userId]);
    return (data || []).map(camelCaseObject) as Notification[];
}

export const postNotification = async (sender: string, recipients: string[], type: NotificationType, data?: string | null): Promise<void> => {
    const notif = new Notification(sender, recipients, type, data || null);
    await supabaseAdmin
        .from('notifications')
        .insert(snakeCaseObject(notif));
}