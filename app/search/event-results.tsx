import { formatDate, formatDateForDisplay } from '@/lib/dates';
import { arrangeEventsByDate, pluralize, singularize } from '@/lib/helper-functions';
import { getOccurrencesForEvents, getEventsByTheatre, getEventsInRange } from '@/lib/shows';
import { allEventTypes, Event, EventOccurrence, EventType } from '@/types';
import ItemCard from './item-card';
import Link from 'next/link';
import Button from '@/components/form/button';

const DEFAULT_LIMIT = 15;
type SearchParamValue = string | string[] | undefined;

const getLimit = (limit?: number) => {
    if (!limit || limit < 1) return DEFAULT_LIMIT;
    return limit;
}

const getSearchParamValues = (value: SearchParamValue): string[] => (
    (Array.isArray(value) ? value : [value]).filter(Boolean).map((item) => item!.trim()).filter(Boolean)
);

const uniqueEvents = (events: Event[]): Event[] => {
    const seen = new Set<string>();
    return events.filter((event) => {
        const key = `${event.type || ''}:${event.id}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

const getLoadMoreHref = (params: { [key: string]: SearchParamValue }, nextLimit: number, resultsPath: string) => {
    const nextParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        getSearchParamValues(value).forEach((item) => nextParams.append(key, item));
    });
    nextParams.set('limit', nextLimit.toString());
    return `${resultsPath}?${nextParams.toString()}`;
}

export default async function EventResults({ showTheatre = true, eventType = 'all', city, state, theatre, zipcode, miles, limit, startDate, searchParams = {}, resultsPath = '/search' }: {
    eventType?: string;
    city?: string;
    state?: string;
    theatre?: string | string[];
    zipcode?: string;
    miles?: number;
    limit?: number;
    startDate?: string;
    showTheatre?: boolean;
    searchParams?: { [key: string]: SearchParamValue };
    resultsPath?: string;
}) {
    const normalizedLimit = getLimit(limit);
    const normalizedStartDate = startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate) ? startDate : undefined;
    const theatreValues = getSearchParamValues(theatre);
    const handleSearchParams = async () => {
        const type = eventType === 'all' ? 'all' : singularize(eventType) as EventType;
        let events: Event[] = [];
        if (theatreValues.length) {
            events = uniqueEvents((await Promise.all(theatreValues.map((theatre) => getEventsByTheatre(theatre, type)))).flat());
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
        return await arrangeEventsByDate(eventDates, events, normalizedStartDate, normalizedLimit + 1);
    }

    const hasActiveQuery = Boolean(theatreValues.length || zipcode || (city && state));
    const allResults = await handleSearchParams();
    const resultDates = allResults ? Object.keys(allResults) : [];
    const visibleDates = resultDates.slice(0, normalizedLimit);
    const hasMore = resultDates.length > normalizedLimit;
    const results = allResults && visibleDates.length ? Object.fromEntries(
        visibleDates.map((date) => [date, allResults[date]])
    ) : null;
    const hasNoResults = hasActiveQuery && !results;

    return (
        <>
            {hasNoResults && <p className="text-mist-700 dark:text-mist-300 mt-4 ml-8">No results found.</p>}
            {results && Object.keys(results).map((date, i) => (
                <div key={i} className='flex flex-col w-full px-4'>
                    <div className='mx-3 my-2 px-2 border-b border-slate-300'>
                        <h2 className='text-slate-900 dark:text-slate-100 font-semibold '>{date === formatDate(new Date()) ? 'Today' : formatDateForDisplay(date)}</h2>
                    </div>
                    <div className='flex flex-row flex-wrap'>
                        {results[date].map(({ event, time }, i) => <ItemCard showTheatre={showTheatre} key={i} item={event} time={time} type={event.type ? pluralize(event.type) : eventType} date={date} />)}
                    </div>
                </div>
            ))}
            {hasMore ? (
                <div className="mt-4 mb-2 flex w-full justify-center">
                    <Link href={getLoadMoreHref(searchParams, normalizedLimit + DEFAULT_LIMIT, resultsPath)} scroll={false}>
                        <Button caption="Load More" style="link" />
                    </Link>
                </div>
            ) : null}
        </>
    )
}
