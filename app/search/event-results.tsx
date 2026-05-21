import { formatDate, formatDateForDisplay } from '@/lib/dates';
import { arrangeEventsByDate } from '@/lib/helper-functions';
import { getShowsByTheatre, getShowsByZipcode } from '@/lib/shows';
import { Event } from '@/types';
import EventCard from './event-card';

export default async function EventResults({ eventType, theatre, zipcode, miles }: {
    eventType: string;
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
                } else if (zipcode) {
                    const shows = await getShowsByZipcode(zipcode, miles || 1) as Event[];
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
            {hasNoResults && <p className="text-slate-700 mt-4">No results found.</p>}
            {results && Object.keys(results).map((date, i) => (
                <div key={i} className='flex flex-col w-full px-4'>
                    <div className='mx-3 my-2 px-2 border-b border-slate-300'>
                        <h2 className='text-slate-900 font-semibold '>{date === formatDate(new Date()) ? 'Today' : formatDateForDisplay(date)}</h2>
                    </div>
                    <div className='flex flex-row'>
                        {results[date].map((event, i) => <EventCard key={i} event={event} type={eventType} />)}
                    </div>
                </div>
            ))}
        </>
    )
}