'use client';

import { useState } from "react";
import DistanceSelect from "@/components/form/distance-select";
import StateSelect from "@/components/form/state-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/form/input";

export default function SearchBar() {
    const searchTypes = ['theatre', 'state', 'zipcode']
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);


    const [sortBy, setSortBy] = useState('theatre');

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
    
    return (
        <section className="w-full h-24 flex flex-row items-center justify-between px-6 py-3">
            <div className="w-1/4">
                <div>
                    <select
                        className="border border-gray-300 rounded px-3 py-2 mb-2"
                        onChange={(e) => {
                            handleSearchFor(e.currentTarget.value);
                        }}
                    >
                        <option value="">Search for...</option>
                        <option value="auditions">Auditions</option>
                        <option value="jams">Jams</option>
                        <option value="shows">Shows</option>
                        <option value="performers">Performers</option>
                        <option value="teams">Teams</option>
                        <option value="theatres">Theatres</option>
                        <option value="workshops">Workshops</option>
                    </select>
                    <select
                        className="border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => {
                            setSortBy(e.currentTarget.value);
                            searchTypes.forEach((type) => params.delete(type))
                            replace(`${pathname}?${params.toString()}`);
                        }}
                    >
                        <option value="">Search by...</option>
                        <option value="theatre">Theatre Name</option>
                        <option value="state">State</option>
                        <option value="zipcode">ZIP Code</option>
                    </select>
                </div>
            </div>
            <div className="w-1/2">
                {sortBy === 'state' && <StateSelect onChange={(value) => handleSearch('state', value)} />}
                {sortBy === 'zipcode' && <DistanceSelect label="Theatres" onUpdate={(zipcode, miles) => {
                    handleSearch('zipcode', zipcode);
                    handleSearch('miles', miles.toString());
                }} />}
                {sortBy === 'theatre' && <Input onChange={(value) => handleSearch('theatre', value)} name="theatre" placeholder="Search by theatre name..." />}
            </div>
        </section>
    )
}