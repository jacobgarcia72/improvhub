import Loader from "@/components/loader";
import MiniCard from "@/components/mini-card";
import { capitalize, pluralize } from "@/lib/helper-functions";
import { getShowsLookingForRole } from "@/lib/shows"
import { Event, Role, User } from "@/types";
import { Suspense } from "react";

export default async function ShowsLookingFor({ role, limit, user } : { role: Role | 'team', limit?: number, user: User }) {
    const shows = await getShowsLookingForRole(role, user);

    let showsByDate: { dateTime: string, show: Event }[] = [];
    shows?.forEach(({ show, dateTimes }) => {
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
                    <h2 className="text-slate-700 dark:text-slate-300">{`Shows Looking for ${capitalize(pluralize(role))}`}</h2>
                    <div className="flex flex-row flex-wrap">
                        {showsByDate.map(({ show, dateTime }, i) => <MiniCard key={i} item={show} type="show" dateTime={dateTime} />)}
                    </div>
                </section>
            ) : null}
        </Suspense>
    )
}