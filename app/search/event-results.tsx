import { formatDate, formatDateForDisplay } from '@/lib/dates';
import { arrangeEventsByDate } from '@/lib/helper-functions';
import { getShowingsForEvents, getShowsByTheatre, getShowsInRange } from '@/lib/shows';
import { Event, Showing } from '@/types';
import ItemCard from './item-card';

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
                let shows: Event[] = []
                if (theatre) {
                    shows = await getShowsByTheatre(theatre);
                } else if (zipcode || (city && state)) {
                    shows = await getShowsInRange(zipcode || `${city} ${state}`, miles || 0);
                }
                if (!shows.length) return null;
                const showDates: Showing[] = await getShowingsForEvents(shows.map(({ id }) => id));
                return arrangeEventsByDate(showDates, shows);
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
                    <div className='flex flex-row flex-wrap'>
                        {results[date].map(({ event, time }, i) => <ItemCard key={i} item={event} time={time} type={eventType} />)}
                    </div>
                </div>
            ))}
        </>
    )
}