'use client';
import { useSearchParams } from 'next/navigation'
import SearchWithOptions from "@/components/form/search-with-options";
import Image from "next/image";
import { getTheatreByName, getTheatreNames, getTheatresByState } from '@/lib/theatres';
import { filterArrayBySearchTerm } from '@/lib/helper-functions';

export default function TheatreSearch() {
    const searchParams = useSearchParams();
    const nameQuery = searchParams.get('name');
    const stateQuery = searchParams.get('state');
    const zipcodeQuery = searchParams.get('zipcode');
    const milesQuery = searchParams.get('miles');
    const theatreNames = getTheatreNames();

    const handleSearchParams = () => {
        if (nameQuery) return filterArrayBySearchTerm(theatreNames, nameQuery).map(getTheatreByName);
        if (stateQuery) return getTheatresByState(stateQuery);
        if (zipcodeQuery) return // TODO: search by miles from zipcode
        return null;
    }
    return (
        <>
            <SearchWithOptions />
            <section className="flex flex-col px-4 pb-4">
                {handleSearchParams()?.map((theatre, index) => (
                    <div key={index} className="border border-gray-300 rounded p-4 mb-4">
                        {theatre?.logo && <Image src={theatre.logo} alt={`${theatre.name} logo`} width={100} height={100} className="mb-2" />}
                        <h2 className="text-xl font-bold">{theatre?.name}</h2>
                    </div>
                ))}
            </section>
        </>
    )
}