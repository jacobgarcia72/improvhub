import { protectRoute } from "@/lib/auth";
import { getNotifications, getNumberOfNotifications } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/users";
import { Notification } from "@/types";
import { notFound } from "next/navigation";
import NotificationCard from "./notification-card";
import { Metadata } from "next";
import { appName } from "@/lib/app-info";

export const metadata: Metadata = {
    title: `Notifications | ${appName}`
};

export default async function NotificationsPage() {
    await protectRoute();
    const user = await getCurrentUser();
    if (!user?.uid) notFound();
    const uid = user.uid;
    const id = user.id;
    const notificationData = uid ? await getNotifications(uid) : null;
    const notifications = notificationData?.notifitactions || [];
    const lastChecked = notificationData?.lastChecked || '';
    return (
        <section className="medium-section flex flex-col">
            <h1 className="text-xl mb-2">Notifications</h1>
            {notifications.map((notif, i) => (
                <NotificationCard isNew={notif.date === null || new Date(notif.date) > new Date(lastChecked)} key={i} userId={id} notification={notif} />
            ))}
        </section>
    )
}