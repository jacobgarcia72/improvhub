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

export const postNotification = async (sender: string, recipients: string[], type: NotificationType, data?: string | null): Promise<void> => {
    const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('uid')
        .in('id', recipients);
    if (usersError) throw usersError;

    const uids: string[] = (users || [])
        .map((user: { uid: string | null }) => user.uid)
        .filter((uid: string | null): uid is string => Boolean(uid));
    if (!uids.length) return;

    const { data: res, error: notificationError } = await supabaseAdmin
        .from('notifications')
        .insert({ sender, type, data })
        .select('id')
        .single();
    if (notificationError) throw notificationError;

    const { error: recipientError } = await supabaseAdmin
        .from('notification_ids')
        .insert(uids.map((uid) => ({
            user_id: uid, notification_id: res.id
        })));
    if (recipientError) throw recipientError;
}
