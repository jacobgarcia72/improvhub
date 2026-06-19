import { getShowsByCastMember } from "@/lib/shows";
import { Event } from "@/types";
import MiniCard from "@/components/mini-card";

export default async function UserShows({ userId, label = "Show's I'm In", limit }: { userId: string, label?: string, limit?: number }) {
    const showsUserIsIn = userId ? await getShowsByCastMember(userId) : null;
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