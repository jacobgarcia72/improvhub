import { getUpcomingShowsByCastMember } from "@/lib/shows";
import { Event, Role } from "@/types";
import MiniCard from "@/components/mini-card";
import { Suspense } from "react";
import Loader from "./loader";

export default async function UpcomingShows({ id, label = "Upcoming Shows", limit, roles, includeTroupes }: { id: string, label?: string, limit?: number, roles?: (Role | 'troupe')[], includeTroupes?: boolean }) {
    const showsUserIsIn = id ? await getUpcomingShowsByCastMember(id, roles, includeTroupes) : [];
    let showsByDate: { dateTime: string, show: Event }[] = [];
    showsUserIsIn?.forEach(({ show, dateTimes }) => {
        dateTimes.forEach((dateTime) => {
            showsByDate.push({ dateTime, show });
        })
    });
    showsByDate.sort((a, b) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    if (limit) showsByDate = showsByDate.slice(0, limit);
    return (
        <Suspense fallback={<Loader />}>
            {showsByDate?.length ? (
                <section>
                    <h2 className="text-slate-700 dark:text-slate-300">{label}</h2>
                    <div className="flex flex-row flex-wrap">
                        {showsByDate.map(({ show, dateTime }, i) => <MiniCard key={i} item={show} type="show" dateTime={dateTime} />)}
                    </div>
                </section>
            ) : null}
        </Suspense>
    )
}