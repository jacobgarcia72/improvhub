import { getTheatreByName, getTheatreNames, getTheatresByDistance, getTheatresByState } from '@/lib/theatres';
import { filterArrayBySearchTerm } from '@/lib/helper-functions';
import TheatreCard from './theatre-card';
import { getShowsByTheatre } from '@/lib/shows';
import { Event, Theatre } from '@/types';

export default async function SearchResults({ params }: { params: {
    theatre?: string;
    state?: string;
    zipcode?: string;
    miles?: string;
    for?: 'theatres' | 'shows';
}}) {
    const theatreNameQuery = params?.theatre;
    const stateQuery = params?.state;
    const zipcodeQuery = params?.zipcode;
    const milesQuery = params?.miles;
    const searchFor = params?.for;
    const theatreNames = getTheatreNames();

    const handleSearchParams = async () => {
        switch (searchFor) {
            case 'theatres':
                if (theatreNameQuery) return filterArrayBySearchTerm(theatreNames, theatreNameQuery, 20).map(getTheatreByName);
                if (stateQuery) return getTheatresByState(stateQuery);
                if (zipcodeQuery) return getTheatresByDistance(zipcodeQuery, Number(milesQuery));
            case 'shows':
                if (theatreNameQuery) return await getShowsByTheatre(theatreNameQuery);
            default:
                return null;
        }
    }

    const hasActiveQuery = theatreNameQuery || stateQuery || zipcodeQuery;
    const results = await handleSearchParams();
    const hasNoResults = hasActiveQuery && results?.length === 0;

    return (
        <section className="flex flex-row flex-wrap gap-4 px-4 pb-4 justify-center min-h-[308px]">
            {hasNoResults && <p className="text-gray-500 mt-4">No results found.</p>}
            {results?.map((result, i) => {
                if (!result) return;
                if (searchFor === 'theatres') return <TheatreCard key={i} theatre={result as Theatre} />
                if (searchFor === 'shows') return <p key={i}>{(result as Event).title} at {(result as Event).theatre}</p>
                return;
            })}
        </section>
    )
}