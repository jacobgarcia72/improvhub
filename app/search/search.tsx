'use client';

import { useSearchParams } from 'next/navigation'
import { getTheatreByName, getTheatreNames, getTheatresByDistance, getTheatresByState } from '@/lib/theatres';
import { filterArrayBySearchTerm } from '@/lib/helper-functions';
import SearchBar from './search-bar';
import TheatreCard from './theatre-card';

export default function Search() {
    const searchParams = useSearchParams();
    const theatreNameQuery = searchParams.get('theatre');
    const stateQuery = searchParams.get('state');
    const zipcodeQuery = searchParams.get('zipcode');
    const milesQuery = searchParams.get('miles');
    const searchFor = searchParams.get('for');
    const theatreNames = getTheatreNames();

    const handleSearchParams = () => {
        switch (searchFor) {
            case 'theatres':
                if (theatreNameQuery) return filterArrayBySearchTerm(theatreNames, theatreNameQuery, 20).map(getTheatreByName);
                if (stateQuery) return getTheatresByState(stateQuery);
                if (zipcodeQuery) return getTheatresByDistance(zipcodeQuery, Number(milesQuery));
            default:
                return null;
        }
    }

    const hasActiveQuery = theatreNameQuery || stateQuery || zipcodeQuery;
    const results = handleSearchParams();
    const hasNoResults = hasActiveQuery && results?.length === 0;

    return (
        <>
            <SearchBar />
            <section className="flex flex-row flex-wrap gap-4 px-4 pb-4 justify-center min-h-[308px]">
                {hasNoResults && <p className="text-gray-500 mt-4">No results found.</p>}
                {results?.map((result, i) => {
                    if (!result) return;
                    if (searchFor === 'theatres') return <TheatreCard key={i} theatre={result} />
                    return;
                })}
            </section>
        </>
    )
}