'use client';

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function Notifications({ uid, numberOfNotifications }: { uid: string, numberOfNotifications: number }) {
    const [notifications, setNotifications] = useState<number>(numberOfNotifications);

    useEffect(() => {
        const channel = supabase
            .channel(`notification_ids_stream:${uid}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "notification_ids", filter: `user_id=eq.${uid}` },
                (payload) => {
                    const notificationId = payload.new.notification_id;
                    if (notificationId) setNotifications(notifications + 1);
                }
            )
            .subscribe(console.log);

        return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid]);

    return (
        <div className={`${notifications ? 'bg-lime-600' : 'bg-mist-500'} shadow-sm shadow-black w-[29px] h-[29px] flex items-center justify-center rounded-full text-white hover:text-white transition-all duration-200 group-hover:scale-110`}>
            {notifications}
        </div>
    );
}
