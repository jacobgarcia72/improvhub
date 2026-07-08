'use client';

import { supabase } from "@/lib/supabase";
import { Notification } from "@/types";
import { useEffect } from "react";

export default function Notifications({ uid, initialData }: { uid: string, initialData: Notification[] }) {
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
        <div>
            {initialData.length}
        </div>
    );
}
