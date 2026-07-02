import EventResults from './event-results';
import { filterArrayBySearchTerm, matchPattern, shuffle } from '@/lib/helper-functions';
import { separateCityAndState } from '@/lib/location';
import { getAllTheatres, getTheatre, getTheatresByCity, getTheatresByState, getTheatresByZipcode } from '@/lib/theatres';
import { Team } from '@/types';
import { getTeamsByTheatre, getTeamsInRange } from '@/lib/teams';
import ItemCard from './item-card';
import { Suspense } from 'react';
import Loader from '@/components/loader';
import { getCurrentUserId } from '@/lib/users';

export default async function SearchResults({ params }: { params: {
    theatre?: string;
    location?: string;
    miles?: string;
    for?: 'theatres' | 'shows' | 'jams' | 'teams' | 'classes' | 'workshops';
}}) {
    const eventTypes = ['shows', 'jams', 'classes', 'workshops'];
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
    const theatres = await getAllTheatres();

    const handleSearchParams = async () => {
        const radius = Number(miles);
        if (searchFor === 'theatres') {
            if (theatre) return await Promise.all(filterArrayBySearchTerm(theatres, theatre, 24).map(async (res) => await getTheatre(typeof res === 'string' ? res : res.id.toString())));
            if (city && state) return await getTheatresByCity(city, state, radius);
            if (state) return await getTheatresByState(state);
            if (zipcode) return await getTheatresByZipcode(zipcode, radius || 1);
        } else if (searchFor === 'teams') {
            if (theatre) return shuffle(await getTeamsByTheatre(theatre) as Team[]);
            if (zipcode || (city && state)) return shuffle(await getTeamsInRange(zipcode || `${city} ${state}`, radius || 0) as Team[]);
        }
        return [];
    }

    const hasActiveQuery = Boolean(theatre || state || zipcode);
    const results = (await handleSearchParams()).filter(Boolean);
    const hasNoResults = hasActiveQuery && results?.length === 0;

    const userId = await getCurrentUserId();

    return (
        <section className="max-w-[1200px]! flex flex-row flex-wrap px-4 pb-4 justify-evenly min-h-[calc(100vh-220px)]">
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
                {results?.map((result, i) => result ? (
                    <ItemCard key={i} item={result} type={searchFor || ''} userId={userId || null} />
                ) : null)}
            </>}
            </Suspense>
        </section>
    )
}