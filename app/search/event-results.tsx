import { formatDate, formatDateForDisplay } from '@/lib/dates';
import { arrangeEventsByDate } from '@/lib/helper-functions';
import { getShowsByTheatre, getShowsInRange } from '@/lib/shows';
import { Event } from '@/types';
import EventCard from './event-card';
import { Suspense } from 'react';
import Loader from '@/components/loader';

export default async function EventResults({ eventType, city, state, theatre, zipcode, miles }: {
    eventType: string;
    city?: string;
    state?: string;
    theatre?: string;
    zipcode?: string;
    miles?: number;
}) {
    const handleSearchParams = async () => {
        switch (eventType) {
            case 'shows':
                if (theatre) {
                    const shows = await getShowsByTheatre(theatre) as Event[];
                    return arrangeEventsByDate(shows);
                } else if (zipcode || (city && state)) {
                    const shows = await getShowsInRange(zipcode || `${city} ${state}`, miles || 0) as Event[];
                    return arrangeEventsByDate(shows);
                }
            default:
                return null;
        }
    }

    const hasActiveQuery = Boolean(theatre || zipcode);
    const results = await handleSearchParams();
    const hasNoResults = hasActiveQuery && !results;

    return (
        <>
            <Suspense fallback={<Loader />}>
            {hasNoResults && <p className="text-slate-700 mt-4">No results found.</p>}
            {results && Object.keys(results).map((date, i) => (
                <div key={i} className='flex flex-col w-full px-4'>
                    <div className='mx-3 my-2 px-2 border-b border-slate-300'>
                        <h2 className='text-slate-900 font-semibold '>{date === formatDate(new Date()) ? 'Today' : formatDateForDisplay(date)}</h2>
                    </div>
                    <div className='flex flex-row flex-wrap'>
                        {results[date].map((result, i) => <EventCard key={i} event={result.event} time={result.time} type={eventType} />)}
                    </div>
                </div>
            ))}
            </Suspense>
        </>
    )
}