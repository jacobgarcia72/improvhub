import { revalidatePath } from "next/cache";
import { Notification, NotificationType } from "@/types";
import { supabaseAdmin } from "./supabase-server";

export const getNotifications = async (uid: string): Promise<Notification[]> => {
    const { data: notifIds, error: notifIdsError } = await supabaseAdmin
        .from('notification_ids')
        .select('notification_id')
        .eq('user_id', uid);
    if (notifIdsError) throw notifIdsError;
    if (!notifIds?.length) return [];
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .select('*')
        .in('id', notifIds.map(({ notification_id }: { notification_id: string }) => notification_id));
    if (error) throw error;
    return data || [] as Notification[];
}

export const getNumberOfNotifications = async (uid: string): Promise<number> => {
    return (await getNotifications(uid)).length;
}

export const postNotification = async (sender: string, recipients: string[], type: NotificationType, data?: string | null): Promise<string | null> => {
    const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('uid')
        .in('id', recipients);
    if (usersError) throw usersError;

    const uids: string[] = (users || [])
        .map((user: { uid: string | null }) => user.uid)
        .filter((uid: string | null): uid is string => Boolean(uid));
    if (!uids.length) return null;

    const { data: res, error: notificationError } = await supabaseAdmin
        .from('notifications')
        .insert({ sender, type, data, recipients })
        .select('id')
        .single();
    if (notificationError) throw notificationError;

    const { error: recipientError } = await supabaseAdmin
        .from('notification_ids')
        .insert(uids.map((uid) => ({
            user_id: uid, notification_id: res.id
        })));
    if (recipientError) throw recipientError;
    revalidatePath('/notifications');
    return res.id;
}

export async function deleteNotification(id: string) {
    const { error: idError } = await supabaseAdmin
        .from('notification_ids')
        .delete()
        .eq('notification_id', id);
    if (idError) throw idError;
    const { error } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('id', id);
    if (error) throw error;
    revalidatePath('/notifications');
    return { id };
}
