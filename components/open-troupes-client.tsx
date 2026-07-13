"use client";

import { Suspense, useState } from "react";
import MiniCard from "@/components/mini-card";
import { Role, Troupe } from "@/types";
import { pluralize } from "@/lib/helper-functions";
import Loader from "./loader";
import Button from "./form/button";

export default function OpenTroupesClient({ initialTroupes, role }: { initialTroupes: Troupe[], role: Role }) {
    const [troupes, setTroupes] = useState<Troupe[]>(initialTroupes || []);
    const [loading, setLoading] = useState(false);

    async function refresh() {
        try {
            setLoading(true);
            const res = await fetch(`/api/open-troupes?role=${encodeURIComponent(role)}`);
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            setTroupes(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (!troupes?.length) return null;
    return (
        <section>
            <div className="flex items-center justify-between px-3">
                <h2 className="px-3">{`Troupes looking for ${pluralize(role)}`}</h2>
                <Button caption="Refresh" onClick={refresh} style="link" disabled={loading} />
            </div>
            <div className="flex flex-row flex-wrap">
                <Suspense fallback={<Loader />}>
                    {troupes.map((troupe, i) => <MiniCard key={troupe.id || i} item={troupe} type="troupe" />)}
                </Suspense>
            </div>
        </section>
    )
}
