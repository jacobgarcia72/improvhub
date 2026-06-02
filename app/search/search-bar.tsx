'use client';

import { useState } from "react";
import DistanceSelect from "@/components/form/distance-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Autocomplete from "@/components/form/autocomplete";
import { getTheatreNames } from "@/lib/theatres";
import { capitalize } from "@/lib/helper-functions";

export default function SearchBar() {
    const searchTypes = ['theatre', 'location', 'miles'];
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const searchFor = searchParams.get('for');

    const theatre = searchParams.get('theatre')?.trim() || '';
    const location = searchParams.get('location')?.trim() || '';
    const miles = searchParams.get('miles')?.trim() || '';
    const [searchBy, setSearchBy] = useState(() => {
        if (theatre) return 'theatre';
        if (location) return 'location';
        return ''
    });

    const handleSearchFor = (searchFor: string) => {
        replace(pathname);
        if (searchFor) {
            params.set('for', searchFor);
            replace(`${pathname}?${params.toString()}`);
        }
    }

    const handleSearch = (type: string, term: string) => {
        if (term) {
            params.set(type, term);
        } else {
            params.delete(type);
        }
        replace(`${pathname}?${params.toString()}`);
    }

    function SearchParams() {
        if (!searchBy || !searchFor) return null;
        switch (searchBy) {
            case 'location':
                return <DistanceSelect
                    onUpdate={(location, miles) => {
                        handleSearch('location', location);
                        handleSearch('miles', miles.toString())
                    }}
                    startingLocation={location?.replaceAll('+', ' ') || undefined}
                    startingMiles={miles ? Number(miles) : undefined}
                />
            case 'theatre':
                return <div className="w-[358px]">
                    <Autocomplete
                        startingValue={theatre ? capitalize(theatre.replaceAll('+', ' ')) : undefined}
                        onStopTyping={(value) => handleSearch('theatre', value)}
                        options={getTheatreNames()}
                        label="Theatre Name"
                    />
                    </div>
            default:
                return null;
        }
    }
    
    return (
        <section className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[140px] max-w-[200px]">
                <label htmlFor="searchFor">Find</label>
                <select
                    value={searchFor || ''}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={(e) => {
                        handleSearchFor(e.currentTarget.value);
                    }}
                >
                    <option value=""></option>
                    {/* <option value="auditions">Auditions</option> */}
                    {/* <option value="jams">Jams</option> */}
                    <option value="shows">Shows</option>
                    {/* <option value="performers">Performers</option> */}
                    <option value="teams">Teams</option>
                    <option value="theatres">Theatres</option>
                    {/* <option value="workshops">Workshops</option> */}
                </select>
            </div>
            <div className="flex-1 min-w-[140px] max-w-[200px]">
                <label htmlFor="searchBy">Search By</label>
                <select
                    value={searchBy}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={(e) => {
                        setSearchBy(e.currentTarget.value);
                        searchTypes.forEach((type) => params.delete(type))
                        replace(`${pathname}?${params.toString()}`);
                    }}
                >
                    <option value=""></option>
                    <option value="location">Location</option>
                    <option value="theatre">Theatre Name</option>
                </select>
            </div>
            {SearchParams()}
        </section>
    )
}