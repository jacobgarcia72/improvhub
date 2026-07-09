import { protectRoute } from "@/lib/auth";
import { getNotifications } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/users";
import { Notification } from "@/types";
import { notFound } from "next/navigation";
import NotificationContent from "./notification-content";

export default async function NotificationsPage() {
    await protectRoute();
    const user = await getCurrentUser();
    if (!user) notFound();
    const uid = user.uid;
    const id = user.id;
    const notifications: Notification[] = uid ? await getNotifications(uid) : [];

    return (
        <section className="medium-section flex flex-col gap-2">
            {notifications.map((notif, i) =>  (
                <div key={i} className="border-b border-b-black/20 p-2">
                    <NotificationContent userId={id} notification={notif} />
                </div>)
            )}
        </section>
    )
}