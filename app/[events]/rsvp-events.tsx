import Loader from "@/components/loader";
import MiniCard from "@/components/mini-card";
import { capitalize, pluralize } from "@/lib/helper-functions";
import { getUpcomingEventsByRSVP } from "@/lib/shows"
import { Event, EventType } from "@/types";
import { Suspense } from "react";

export default async function RSVPEvents({ userId, type, limit } : { userId: string, type: EventType, limit?: number }) {
    const events = await getUpcomingEventsByRSVP(userId, type);

    let eventsByDate: { dateTime: string, event: Event }[] = [];
    events?.forEach(({ event, dateTimes }) => {
        dateTimes.forEach((dateTime) => {
            eventsByDate.push({ dateTime, event });
        })
    });
    eventsByDate.sort((a, b) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    if (limit) eventsByDate = eventsByDate.slice(0, limit);
    return (
        <Suspense fallback={<Loader />}>
            {eventsByDate?.length ? (
                <section>
                    <h2 className="text-slate-700 dark:text-slate-300">{`${pluralize(capitalize(type))} I've RSVP'ed to`}</h2>
                    <div className="flex flex-row flex-wrap">
                        {eventsByDate.map(({ event, dateTime }, i) => <MiniCard key={i} item={event} type={type} dateTime={dateTime} />)}
                    </div>
                </section>
            ) : null}
        </Suspense>
    )
}