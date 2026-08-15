import EventResults from './event-results';
import { filterArrayBySearchTerm, matchPattern, pluralize, shuffle } from '@/lib/helper-functions';
import { separateCityAndState } from '@/lib/location';
import { getAllTheatres, getTheatre, getTheatresByCity, getTheatresByState, getTheatresByZipcode } from '@/lib/theatres';
import { allEventTypes, Role, Troupe, User } from '@/types';
import { getTroupesByTheatre, getTroupesInRange } from '@/lib/troupes';
import ItemCard from './item-card';
import { Suspense } from 'react';
import Loader from '@/components/loader';
import { getAvailableUsersByRole, getAvailableUsersByRoleInRange, getCurrentUserId } from '@/lib/users';
import Link from 'next/link';
import Button from '@/components/form/button';

const CARD_RESULTS_PAGE_SIZE = 24;
type SearchParamValue = string | string[] | undefined;

const getCardResultsLimit = (limit?: number) => {
    if (!limit || limit < CARD_RESULTS_PAGE_SIZE) return CARD_RESULTS_PAGE_SIZE;
    return Math.ceil(limit / CARD_RESULTS_PAGE_SIZE) * CARD_RESULTS_PAGE_SIZE;
}

const getSearchParamValues = (value: SearchParamValue): string[] => (
    (Array.isArray(value) ? value : [value]).filter(Boolean).map((item) => item!.trim()).filter(Boolean)
);

const uniqueById = <T extends { id: string }>(items: T[]): T[] => {
    const seen = new Set<string>();
    return items.filter((item) => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });
}

const getLoadMoreHref = (params: { [key: string]: SearchParamValue }, nextLimit: number) => {
    const nextParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        getSearchParamValues(value).forEach((item) => nextParams.append(key, item));
    });
    nextParams.set('limit', nextLimit.toString());
    return `/search?${nextParams.toString()}`;
}

export default async function SearchResults({ params }: { params: {
    theatre?: string | string[];
    location?: string;
    miles?: string;
    for?: 'theatres' | 'shows' | 'jams' | 'troupes' | 'classes' | 'workshops' | 'coaches' | 'musicians';
    limit?: string;
    startDate?: string;
}}) {
    const eventTypes = [...allEventTypes.map((type) => pluralize(type)), 'all'];
    const theatreValues = getSearchParamValues(params?.theatre);
    const theatre = theatreValues[0];
    const location = params?.location?.trim();
    const miles = params?.miles?.trim();
    const searchFor = params?.for;
    const startDate = params?.startDate?.trim();
    const limit = Number.parseInt(params?.limit || '', 10);
    const cardResultsLimit = getCardResultsLimit(Number.isNaN(limit) ? undefined : limit);
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

    const getAvailableUsersByTheatres = async (role: Role, theatres: string[]): Promise<User[]> => {
        const theatreDetails = await Promise.all(theatres.map(getTheatre));
        const theatreDetailTerms = theatreDetails.flatMap((theatre) => (
            theatre ? [theatre.id, theatre.name] : []
        ));
        const searchTerms = theatres.concat(theatreDetailTerms).map((term) => term.toLowerCase());

        return shuffle((await getAvailableUsersByRole(role)).filter((user) => (
            user.theatres?.some((userTheatre) => {
                const normalizedTheatre = userTheatre.toLowerCase();
                return searchTerms.some((term) => (
                    normalizedTheatre.includes(term) || term.includes(normalizedTheatre)
                ));
            })
        )));
    }

    const handleSearchParams = async () => {
        const radius = Number(miles);
        if (searchFor === 'theatres') {
            if (theatreValues.length > 1) return await Promise.all(theatreValues.map(getTheatre));
            if (theatre) return await Promise.all(filterArrayBySearchTerm(theatres, theatre, cardResultsLimit + 1).map(async (res) => await getTheatre(typeof res === 'string' ? res : res.id.toString())));
            if (city && state) return await getTheatresByCity(city, state, radius);
            if (state) return await getTheatresByState(state);
            if (zipcode) return await getTheatresByZipcode(zipcode, radius || 1);
        } else if (searchFor === 'troupes') {
            if (theatreValues.length) return shuffle(uniqueById((await Promise.all(theatreValues.map(getTroupesByTheatre))).flat() as Troupe[]));
            if (zipcode || (city && state)) return shuffle(await getTroupesInRange(zipcode || `${city} ${state}`, radius || 0) as Troupe[]);
        } else if (searchFor === 'coaches' || searchFor === 'musicians') {
            const role = searchFor === 'coaches' ? 'coach' : 'musician';
            if (theatreValues.length) return getAvailableUsersByTheatres(role, theatreValues);
            if (city && state) return shuffle(await getAvailableUsersByRoleInRange(role, `${city} ${state}`, radius || 0));
            if (zipcode) return shuffle(await getAvailableUsersByRoleInRange(role, zipcode, radius || 1));
            if (state) return shuffle((await getAvailableUsersByRole(role)).filter((user) => user.state?.toLowerCase() === state.toLowerCase()));
        }
        return [];
    }

    const hasActiveQuery = Boolean(theatre || state || zipcode || (city && state));
    const allResults = (await handleSearchParams()).filter(Boolean);
    const visibleResults = allResults.slice(0, cardResultsLimit);
    const hasMoreResults = allResults.length > cardResultsLimit;
    const hasNoResults = hasActiveQuery && allResults.length === 0;

    const userId = await getCurrentUserId();

    return (
        <section className="max-w-[1280px]! flex flex-row flex-wrap px-4 pb-4 justify-evenly min-h-[calc(100vh-220px)]">
            <Suspense fallback={<Loader caption='results' />}>
            {searchFor && eventTypes.includes(searchFor) ? (
                <EventResults
                    eventType={searchFor}
                    theatre={theatreValues.length > 1 ? theatreValues : theatre}
                    city={city}
                    state={state}
                    zipcode={zipcode}
                    miles={Number(miles)}
                    limit={Number.isNaN(limit) ? undefined : limit}
                    startDate={startDate}
                    searchParams={params}
                />
            ) : <>
                {hasNoResults && <p className="text-gray-500 mt-4">No results found.</p>}
                {visibleResults?.map((result, i) => result ? (
                    <ItemCard key={i} item={result} type={searchFor || ''} userId={userId || null} />
                ) : null)}
                {hasMoreResults ? (
                    <div className="mt-4 mb-2 flex w-full justify-center">
                        <Link href={getLoadMoreHref(params, cardResultsLimit + CARD_RESULTS_PAGE_SIZE)} scroll={false}>
                            <Button caption="Load More" style="link" />
                        </Link>
                    </div>
                ) : null}
            </>}
            </Suspense>
        </section>
    )
}
