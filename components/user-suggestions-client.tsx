"use client";

import { Suspense, useState } from "react";
import MiniCard from "@/components/mini-card";
import { User, Role } from "@/types";
import Loader from "./loader";
import Button from "./form/button";

export default function UserSuggestionsClient({ initialUsers, role, troupeId }: { initialUsers: User[], role: Role, troupeId?: string }) {
    const [users, setUsers] = useState<User[]>(initialUsers || []);
    const [loading, setLoading] = useState(false);

    const refresh = async () => {
        try {
            setLoading(true);
            let apiRoute = `/api/user-suggestions?role=${encodeURIComponent(role)}`;
            if (troupeId) apiRoute += `&troupe=${encodeURIComponent(troupeId)}`;
            const res = await fetch(apiRoute);
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setUsers(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (!users?.length) return null;
    const headers: Record<Role, string> = {
        player: 'Players looking for troupes',
        coach: 'Available coaches',
        musician: 'Musicians available to accompany',
        director: '', tech: ''
    }

    return (
        <section className="pt-1!">
            <div className="flex items-center justify-between px-3">
                <h3 className="px-3 font-semibold text-sm">{headers[role]}</h3>
                <Button caption="Refresh" onClick={refresh} style="link" disabled={loading} />
            </div>
            <div className="flex flex-row flex-wrap">
                <Suspense fallback={<Loader />}>
                    {users.map((user, i) => <MiniCard className="h-[90px]!" key={user.id || i} item={user} type="user" />)}
                </Suspense>
            </div>
        </section>
    )
}
