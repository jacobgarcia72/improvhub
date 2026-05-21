import { getTheatreByName, getTheatreNames, getTheatresByDistance, getTheatresByState } from '@/lib/theatres';
import { filterArrayBySearchTerm } from '@/lib/helper-functions';
import TheatreCard from './theatre-card';
import { Theatre } from '@/types';

export default async function TheatreResults({ theatre, state, zipcode, miles }: {
    theatre?: string;
    state?: string;
    zipcode?: string;
    miles?: number;
}) {
    const theatreNames = getTheatreNames();

    const handleSearchParams = () => {
        if (theatre) return filterArrayBySearchTerm(theatreNames, theatre, 20).map(getTheatreByName);
        if (state) return getTheatresByState(state);
        if (zipcode) return getTheatresByDistance(zipcode, miles || 1);
        return [];
    }

    const hasActiveQuery = Boolean(theatre || state || zipcode);
    const results = handleSearchParams();
    const hasNoResults = hasActiveQuery && results?.length === 0;

    return (
        <>
            {hasNoResults && <p className="text-gray-500 mt-4">No results found.</p>}
            {results?.map((result, i) => <TheatreCard key={i} theatre={result as Theatre} />)}
        </>
    )
}