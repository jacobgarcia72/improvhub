'use client';

import { supabase } from "@/lib/supabase";
import { Notification } from "@/types";
import { useEffect, useState } from "react";

export default function Notifications({ userId, initialData }: { userId: string, initialData: Notification[] }) {
    const [notifs, setNotifs] = useState<Notification[]>(initialData);

    useEffect(() => {
        if (!userId) return;

        const channel = supabase
            .channel(`${userId}-notifications`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notifications",
                },
                (payload) => {
                    const newRecord = payload.new as Notification | null;
                    const oldRecord = payload.old as Notification | null;

                    setNotifs((current) => {
                        if (payload.eventType === "INSERT" && newRecord) {
                            return current.some((notif) => notif.id === newRecord.id)
                                ? current
                                : [newRecord, ...current];
                        }

                        if (payload.eventType === "UPDATE" && newRecord) {
                            return current.map((notif) => notif.id === newRecord.id ? newRecord : notif);
                        }

                        if (payload.eventType === "DELETE" && oldRecord) {
                            return current.filter((notif) => notif.id !== oldRecord.id);
                        }

                        return current;
                    });
                }
            )
            .subscribe((status) => {
                console.log("notifications subscription", status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    return (
        <div>
            {notifs.length}
        </div>
    );
}
