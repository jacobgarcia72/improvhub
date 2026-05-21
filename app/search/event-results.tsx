import { formatDate, formatDateForDisplay } from '@/lib/dates';
import { arrangeEventsByDate } from '@/lib/helper-functions';
import { getShowsByTheatre } from '@/lib/shows';
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
                }
            default:
                return null;
        }
    }

    const hasActiveQuery = Boolean(theatre || zipcode);
    const results = await handleSearchParams();
    const hasNoResults = hasActiveQuery && !results;

    return (
        <section className="flex flex-row flex-wrap gap-4 px-4 pb-4 justify-center min-h-[308px]">
            {hasNoResults && <p className="text-gray-500 mt-4">No results found.</p>}
            {results && Object.keys(results).map((date, i) => (
                <div key={i} className='flex flex-col w-full'>
                    <h2>{date === formatDate(new Date()) ? 'Today' : formatDateForDisplay(date)}</h2>
                    <div className='flex flex-row'>
                        {results[date].map((event, i) => <EventCard key={i} event={event} type={eventType} />)}
                    </div>
                </div>
            ))}
        </section>
    )
}