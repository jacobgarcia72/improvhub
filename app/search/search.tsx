'use client';

import { useSearchParams } from 'next/navigation'
import Image from "next/image";
import { getTheatreByName, getTheatreNames, getTheatresByDistance, getTheatresByState } from '@/lib/theatres';
import { filterArrayBySearchTerm } from '@/lib/helper-functions';
import SearchBar from './search-bar';

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
            <section className="flex flex-col px-4 pb-4">
                {hasNoResults && <p className="text-gray-500 mt-4">No results found.</p>}
                {results?.map((theatre, index) => (
                    <div key={index} className="border border-gray-300 rounded p-4 mb-4">
                        {theatre?.logo && <Image src={theatre.logo} alt={`${theatre.name} logo`} width={100} height={100} className="mb-2" />}
                        <h2 className="text-xl font-bold">{theatre?.name}</h2>
                    </div>
                ))}
            </section>
        </>
    )
}