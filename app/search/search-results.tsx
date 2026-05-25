import TheatreResults from './theatre-results';
import EventResults from './event-results';
import { validateInputValue } from '@/lib/helper-functions';

export default async function SearchResults({ params }: { params: {
    theatre?: string;
    location?: string;
    miles?: string;
    for?: 'theatres' | 'shows' | 'jams';
}}) {
    const theatre = params?.theatre?.trim();
    const location = params?.location?.trim();
    const miles = params?.miles?.trim();
    const searchFor = params?.for;
    let zipcode = '';
    let state = '';
    let city = '';
    if (location) {
        if (validateInputValue(location, 'zipcode')) {
            zipcode = location;
        } else if (validateInputValue(location, 'state')) {
            state = location;
        } else if (validateInputValue(location, 'city')) {
            const split = location.replaceAll(',', '') .split(' ');
            state = split[split.length - 1];
            city = split.slice(0, split.length - 1).join(' ');

        }
    }

    return (
        <section className="flex flex-row flex-wrap gap-4 px-4 pb-4 justify-center min-h-[calc(100vh-220px)]">
            {searchFor === 'theatres' && (
                <TheatreResults
                    theatre={theatre}
                    city={city}
                    state={state}
                    zipcode={zipcode}
                    miles={Number(miles)}
                />
            )}
            {searchFor && ['shows', 'jams'].includes(searchFor) && (
                <EventResults
                    eventType={searchFor}
                    theatre={theatre}
                    // city={city}
                    // state={state}
                    zipcode={zipcode}
                    miles={Number(miles)}
                />
            )}
        </section>
    )
}