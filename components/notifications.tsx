'use client';

import { supabase } from "@/lib/supabase";
import { Notification } from "@/types";
import { useEffect, useState } from "react";

export default function Notifications({ uid, initialData }: { uid: string, initialData: Notification[] }) {
    const [notifications, setNotifications] = useState<Notification[]>(initialData);
    useEffect(() => {
        const channel = supabase
            .channel(`notification_ids_stream:${uid}`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "notification_ids", filter: `user_id=eq.${uid}` },
                (payload) => {
                    console.log("NOTIFICATION:", payload);
                }
            )
            .subscribe(console.log);

        return () => { supabase.removeChannel(channel); };
    }, [uid]);

    return (
        <div className={`${notifications.length ? 'bg-lime-600' : 'bg-mist-500'} shadow-sm shadow-black w-[29px] h-[29px] flex items-center justify-center rounded-full text-white hover:text-white transition-all duration-200 group-hover:scale-110`}>
            {notifications.length}
        </div>
    );
}
