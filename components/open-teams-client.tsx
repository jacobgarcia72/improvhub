"use client";

import { Suspense, useState } from "react";
import MiniCard from "@/components/mini-card";
import { Role, Team } from "@/types";
import { pluralize } from "@/lib/helper-functions";
import Loader from "./loader";
import Button from "./form/button";

export default function OpenTeamsClient({ initialTeams, role }: { initialTeams: Team[], role: Role }) {
    const [teams, setTeams] = useState<Team[]>(initialTeams || []);
    const [loading, setLoading] = useState(false);

    async function refresh() {
        try {
            setLoading(true);
            const res = await fetch(`/api/open-teams?role=${encodeURIComponent(role)}`);
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setTeams(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (!teams?.length) return null;
    return (
        <section>
            <div className="flex items-center justify-between px-3">
                <h2 className="px-3">{`Teams looking for ${pluralize(role)}`}</h2>
                <Button caption="Refresh" onClick={refresh} style="link" disabled={loading} />
            </div>
            <div className="flex flex-row flex-wrap">
                <Suspense fallback={<Loader />}>
                    {teams.map((team, i) => <MiniCard key={team.id || i} item={team} type="team" />)}
                </Suspense>
            </div>
        </section>
    )
}
