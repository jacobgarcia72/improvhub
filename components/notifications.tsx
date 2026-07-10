'use client';

import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Notifications({ uid, numberOfNotifications }: { uid: string, numberOfNotifications: number }) {
    const [notifications, setNotifications] = useState<number>(numberOfNotifications);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (pathname === '/notifications') setNotifications(0);
    }, [pathname]);

    useEffect(() => {
        const revalidateNotifications = async () => {
            await fetch('/api/notification', { method: 'POST' });
            if (pathname === '/notifications') router.refresh();
        };

        const channel = supabase
            .channel(`notification_ids_stream:${uid}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "notification_ids", filter: `user_id=eq.${uid}` },
                (payload) => {
                    const notificationId = payload.new.notification_id;
                    if (notificationId) {
                        setNotifications((current) => current + 1);
                        revalidateNotifications();
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "DELETE", schema: "public", table: "notification_ids", filter: `user_id=eq.${uid}` },
                (payload) => {
                    const notificationId = payload.old.notification_id;
                    if (notificationId) {
                        setNotifications((current) => Math.max(0, current - 1));
                        revalidateNotifications();
                    }
                }
            )
            .subscribe(console.log);

        return () => { supabase.removeChannel(channel); };
    }, [pathname, router, uid]);

    return (
        <div className={`${notifications ? 'bg-lime-600' : 'bg-mist-500'} shadow-sm shadow-black w-[29px] h-[29px] flex items-center justify-center rounded-full text-white hover:text-white transition-all duration-200 group-hover:scale-110`}>
            {notifications}
        </div>
    );
}
