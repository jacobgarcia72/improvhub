'use client';

import { useState } from "react";
import DistanceSelect from "@/components/form/distance-select";
import StateSelect from "@/components/form/state-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Autocomplete from "@/components/form/autocomplete";
import { getTheatreNames } from "@/lib/theatres";

export default function SearchBar() {
    const searchTypes = ['theatre', 'state', 'zipcode'];
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const searchFor = searchParams.get('for');


    const [searchBy, setSearchBy] = useState('');

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
            case 'state':
                return <StateSelect
                    label="State"
                    onChange={(value) => handleSearch('state', value)} 
                />
            case 'zipcode':
                return <DistanceSelect
                    onUpdate={(zipcode, miles) => {
                        handleSearch('zipcode', zipcode);
                        handleSearch('miles', miles.toString());
                    }}
                />
            case 'theatre':
                return <Autocomplete
                    onChange={(value) => handleSearch('theatre', value)}
                    options={getTheatreNames()}
                    label="Theatre Name"
                />
            default:
                return null;
        }
    }
    
    return (
        <section className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[100px]">
                <label htmlFor="searchFor">Find</label>
                <select
                    value={searchFor || ''}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={(e) => {
                        handleSearchFor(e.currentTarget.value);
                    }}
                >
                    <option value=""></option>
                    <option value="auditions">Auditions</option>
                    <option value="jams">Jams</option>
                    <option value="shows">Shows</option>
                    <option value="performers">Performers</option>
                    <option value="teams">Teams</option>
                    <option value="theatres">Theatres</option>
                    <option value="workshops">Workshops</option>
                </select>
            </div>
            <div className="flex-1 min-w-[100px]">
                <label htmlFor="searchBy">Search By</label>
                <select
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={(e) => {
                        setSearchBy(e.currentTarget.value);
                        searchTypes.forEach((type) => params.delete(type))
                        replace(`${pathname}?${params.toString()}`);
                    }}
                >
                    <option value=""></option>
                    <option value="theatre">Theatre Name</option>
                    <option value="state">State</option>
                    <option value="zipcode">ZIP Code</option>
                </select>
            </div>
            <div className="flex-1 min-w-[280px] flex flex-row">
                {SearchParams()}
            </div>
        </section>
    )
}