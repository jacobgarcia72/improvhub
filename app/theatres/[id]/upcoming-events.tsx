import { getUpcomingEventsByTheatre } from "@/lib/shows";
import { Event, EventType, Theatre } from "@/types";
import MiniCard from "@/components/mini-card";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { capitalize, pluralize } from "@/lib/helper-functions";

export default async function UpcomingEvents({ theatre, type = 'show', limit = 72 }: { theatre: Theatre, type?: EventType, limit?: number }) {
    const events = theatre ? await getUpcomingEventsByTheatre(theatre, type) : [];
    console.log({type, events: events.length})
    let eventsByDate: { dateTime: string, event: Event }[] = [];
    events?.forEach(({ event, dateTimes }) => {
        dateTimes.forEach((dateTime) => {
            eventsByDate.push({ dateTime, event });
        })
    });
    eventsByDate.sort((a, b) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    eventsByDate = eventsByDate.slice(0, limit);
    return (
        <Suspense fallback={<Loader />}>
            {eventsByDate?.length ? (
                <section>
                    <h2 className="text-slate-700 dark:text-slate-300 font-semibold">Upcoming {pluralize(capitalize(type))}</h2>
                    <div className="flex flex-row flex-wrap">
                        {eventsByDate.map(({ event, dateTime }, i) => <MiniCard key={i} item={event} type={type} dateTime={dateTime} />)}
                    </div>
                </section>
            ) : null}
        </Suspense>
    )
}