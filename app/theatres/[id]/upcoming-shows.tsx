import { getUpcomingShowsByTheatre } from "@/lib/shows";
import { Event, Theatre } from "@/types";
import MediumCard from "@/components/medium-card";
import { Suspense } from "react";
import Loader from "@/components/loader";

export default async function UpcomingShows({ theatre }: { theatre: Theatre }) {
    const shows = theatre ? await getUpcomingShowsByTheatre(theatre) : [];
    let showsByDate: { dateTime: string, show: Event }[] = [];
    shows?.forEach(({ show, dateTimes }) => {
        dateTimes.forEach((dateTime) => {
            showsByDate.push({ dateTime, show });
        })
    });
    showsByDate.sort((a, b) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    showsByDate = showsByDate.slice(0, 72);
    return (
        <Suspense fallback={<Loader />}>
            {showsByDate?.length ? (
                <section>
                    <h2 className="text-slate-700 font-semibold">Upcoming Shows</h2>
                    <div className="flex flex-row flex-wrap">
                        {showsByDate.map(({ show, dateTime }, i) => <MediumCard key={i} item={show} type="show" dateTime={dateTime} />)}
                    </div>
                </section>
            ) : null}
        </Suspense>
    )
}