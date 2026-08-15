import { protectRoute } from "@/lib/auth";
import { getNotifications } from "@/lib/notifications";
import { getCurrentUser } from "@/lib/users";
import { notFound } from "next/navigation";
import NotificationCard from "./notification-card";
import { Metadata } from "next";
import { appName } from "@/lib/app-info";
import Link from "next/link";
import Button from "@/components/form/button";

export const metadata: Metadata = {
    title: `Notifications | ${appName}`
};

const PAGE_SIZE = 25;

const getLimit = (limitParam?: string) => {
    const limit = Number.parseInt(limitParam || '', 10);
    if (Number.isNaN(limit) || limit < PAGE_SIZE) return PAGE_SIZE;
    return Math.ceil(limit / PAGE_SIZE) * PAGE_SIZE;
}

const getLastChecked = (lastCheckedParam: string | undefined, fallback: string) => {
    if (!lastCheckedParam) return fallback;
    return Number.isNaN(new Date(lastCheckedParam).getTime()) ? fallback : lastCheckedParam;
}

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ limit?: string, lastChecked?: string }> }) {
    await protectRoute();
    const user = await getCurrentUser();
    if (!user?.uid) notFound();
    const uid = user.uid;
    const id = user.id;
    const params = await searchParams;
    const limit = getLimit(params.limit);
    const notificationData = uid ? await getNotifications(uid, limit) : null;
    const notifications = notificationData?.notifitactions || [];
    const lastChecked = getLastChecked(params.lastChecked, notificationData?.lastChecked || '');
    return (
        <section className="medium-section flex flex-col">
            <h1 className="text-xl mb-2">Notifications</h1>
            {notifications.length === 0 ? (
                <p className="mt-5 mb-7 text-mist-600 dark:text-mist-400">You have no notifications.</p>
            ) : notifications.map((notif, i) => (
                <NotificationCard isNew={notif.date === null || new Date(notif.date) > new Date(lastChecked)} key={i} userId={id} notification={notif} />
            ))}
            {notificationData?.hasMore ? (
                <div className="mt-4 mb-2 flex justify-center">
                    <Link href={`/notifications?limit=${limit + PAGE_SIZE}&lastChecked=${encodeURIComponent(lastChecked)}`} scroll={false}>
                        <Button caption="Load More" style="link" />
                    </Link>
                </div>
            ) : null}
        </section>
    )
}
