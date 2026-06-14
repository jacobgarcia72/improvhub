"use client";

import { Suspense, useState } from "react";
import MiniCard from "@/components/mini-card";
import { User, Role } from "@/types";
import Loader from "./loader";
import Button from "./form/button";

export default function UserSuggestionsClient({ initialUsers, role, teamId }: { initialUsers: User[], role: Role, teamId?: string }) {
    const [users, setUsers] = useState<User[]>(initialUsers || []);
    const [loading, setLoading] = useState(false);

    async function refresh() {
        try {
            setLoading(true);
            let apiRoute = `/api/user-suggestions?role=${encodeURIComponent(role)}`;
            if (teamId) apiRoute += `&team=${encodeURIComponent(teamId)}`;
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
        player: 'Players looking for teams',
        coach: 'Available coaches',
        musician: 'Musicians available to accompany',
        director: '', tech: ''
    }

    return (
        <section>
            <div className="flex items-center justify-between px-3">
                <h2 className="px-3 font-semibold">{headers[role]}</h2>
                <Button caption="Refresh" onClick={refresh} style="link" disabled={loading} />
            </div>
            <div className="flex flex-row flex-wrap">
                <Suspense fallback={<Loader />}>
                    {users.map((user, i) => <MiniCard key={user.id || i} item={user} type="user" />)}
                </Suspense>
            </div>
        </section>
    )
}
