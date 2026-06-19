import { getShowsByCastMember } from "@/lib/shows";
import { Event, Role } from "@/types";
import MiniCard from "@/components/mini-card";

export default async function UpcomingShows({ id, label = "Upcoming Shows", limit, roles, includeTeams }: { id: string, label?: string, limit?: number, roles?: (Role | 'team')[], includeTeams?: boolean }) {
    const showsUserIsIn = id ? await getShowsByCastMember(id, roles, includeTeams) : [];
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
        <>
            {showsByDate?.length ? (
                <section>
                    <h2 className="text-slate-700 font-semibold">{label}</h2>
                    <div className="flex flex-row flex-wrap">
                        {showsByDate.map(({ show, dateTime }, i) => <MiniCard key={i} item={show} type="show" dateTime={dateTime} />)}
                    </div>
                </section>
            ) : null}
        </>
    )
}