import { formatDate, formatDateForDisplay } from '@/lib/dates';
import { arrangeEventsByDate, singularize } from '@/lib/helper-functions';
import { getOccurrencesForEvents, getEventsByTheatre, getEventsInRange } from '@/lib/shows';
import { allEventTypes, Event, EventOccurrence, EventType } from '@/types';
import ItemCard from './item-card';

export default async function EventResults({ showTheatre = true, eventType = 'all', city, state, theatre, zipcode, miles, limit }: {
    eventType?: string;
    city?: string;
    state?: string;
    theatre?: string;
    zipcode?: string;
    miles?: number;
    limit?: number;
    showTheatre?: boolean;
}) {
    const handleSearchParams = async () => {
        const type = eventType === 'all' ? 'all' : singularize(eventType) as EventType;
        let events: Event[] = [];
        if (theatre) {
            events = await getEventsByTheatre(theatre, type);
        } else if (zipcode || (city && state)) {
            events = await getEventsInRange(zipcode || `${city} ${state}`, miles || 0, type);
        }
        if (!events.length) return null;
        let eventDates: EventOccurrence[] = []
        if (type === 'all') {
            eventDates = (
                await Promise.all(allEventTypes.map(async (type) => await getOccurrencesForEvents(events.map(({ id }) => id), type)))
            ).flat();
        } else {
            eventDates = await getOccurrencesForEvents(events.map(({ id }) => id), type);
        }
        return arrangeEventsByDate(eventDates, events, undefined, limit);
    }

    const hasActiveQuery = Boolean(theatre || zipcode || (city && state));
    const results = await handleSearchParams();
    const hasNoResults = hasActiveQuery && !results;

    return (
        <>
            {hasNoResults && <p className="text-slate-700 dark:text-slate-300 mt-4">No results found.</p>}
            {results && Object.keys(results).map((date, i) => (
                <div key={i} className='flex flex-col w-full px-4'>
                    <div className='mx-3 my-2 px-2 border-b border-slate-300'>
                        <h2 className='text-slate-900 dark:text-slate-100 font-semibold '>{date === formatDate(new Date()) ? 'Today' : formatDateForDisplay(date)}</h2>
                    </div>
                    <div className='flex flex-row flex-wrap'>
                        {results[date].map(({ event, time }, i) => <ItemCard showTheatre={showTheatre} key={i} item={event} time={time} type={eventType} date={date} />)}
                    </div>
                </div>
            ))}
        </>
    )
}