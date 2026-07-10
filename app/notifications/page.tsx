import { protectRoute } from "@/lib/auth";
import { getNotifications } from "@/lib/notifications";
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
    if (!user) notFound();
    const uid = user.uid;
    const id = user.id;
    const notifications: Notification[] = uid ? await getNotifications(uid, true) : [];

    return (
        <section className="medium-section flex flex-col gap-2">
            <h1 className="text-xl mb-4">Notifications</h1>
            {notifications.map((notif, i) => (
                <NotificationCard key={i} userId={id} notification={notif} />
            ))}
        </section>
    )
}