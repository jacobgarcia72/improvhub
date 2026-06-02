import EventResults from './event-results';
import { filterArrayBySearchTerm, matchPattern } from '@/lib/helper-functions';
import { separateCityAndState } from '@/lib/location';
import { getTheatreByName, getTheatreNames, getTheatresByCity, getTheatresByState, getTheatresByZipcode } from '@/lib/theatres';
import { Team } from '@/types';
import { getTeamsByTheatre, getTeamsInRange } from '@/lib/teams';
import ItemCard from './item-card';
import { Suspense } from 'react';
import Loader from '@/components/loader';

export default async function SearchResults({ params }: { params: {
    theatre?: string;
    location?: string;
    miles?: string;
    for?: 'theatres' | 'shows' | 'jams' | 'teams';
}}) {
    const eventTypes = ['shows', 'jams', 'auditions'];
    const theatre = params?.theatre?.trim();
    const location = params?.location?.trim();
    const miles = params?.miles?.trim();
    const searchFor = params?.for;
    let zipcode = '';
    let state = '';
    let city = '';
    if (location) {
        if (matchPattern(location, 'zipcode')) {
            zipcode = location;
        } else if (matchPattern(location, 'state')) {
            state = location;
        } else if (matchPattern(location, 'city')) {
            const cityAndState = separateCityAndState(location);
            state = cityAndState.state;
            city = cityAndState.city;

        }
    }
        const theatreNames = getTheatreNames();
    
        const handleSearchParams = async () => {
            const radius = Number(miles);
            if (searchFor === 'theatres') {
                if (theatre) return (filterArrayBySearchTerm(theatreNames, theatre, 20) as string[]).map(getTheatreByName);
                if (city && state) return getTheatresByCity(city, state, radius);
                if (state) return getTheatresByState(state);
                if (zipcode) return getTheatresByZipcode(zipcode, radius || 1);
            } else if (searchFor === 'teams') {
                if (theatre) return await getTeamsByTheatre(theatre) as Team[];
                if (zipcode || (city && state)) return await getTeamsInRange(zipcode || `${city} ${state}`, radius || 0) as Team[];
            }
            return [];
        }
    
        const hasActiveQuery = Boolean(theatre || state || zipcode);
        const results = (await handleSearchParams()).filter(Boolean);
        const hasNoResults = hasActiveQuery && results?.length === 0;

    return (
        <section className="flex flex-row flex-wrap px-4 pb-4 justify-evenly min-h-[calc(100vh-220px)]">
            <Suspense fallback={<Loader />}>
            {searchFor && eventTypes.includes(searchFor) ? (
                <EventResults
                    eventType={searchFor}
                    theatre={theatre}
                    city={city}
                    state={state}
                    zipcode={zipcode}
                    miles={Number(miles)}
                />
            ) : <>
                {hasNoResults && <p className="text-gray-500 mt-4">No results found.</p>}
                {results?.map((result, i) => result ? <ItemCard key={i} item={result} type={searchFor || ''} /> : null)}
            </>}
            </Suspense>
        </section>
    )
}