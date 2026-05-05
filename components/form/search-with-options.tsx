'use client';

import { useState } from "react";
import DistanceSelect from "./distance-select";
import StateSelect from "./state-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Input from "./input";

export default function SearchWithOptions() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);


    const [sortBy, setSortBy] = useState('name');

    const handleSearch = (type: string, term: string) => {
        if (term) {
            params.set(type, term);
        } else {
            params.delete(type);
        }
        replace(`${pathname}?${params.toString()}`);
    }
    
    return (
        <section className="w-full h-16 flex flex-row items-center justify-between px-6 py-3">
            <div className="w-1/3">
                <p>
                    Search by &nbsp;
                    <select
                        className="border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => {
                            setSortBy(e.currentTarget.value);
                            replace(pathname)
                        }}
                    >
                        <option value="name">Name</option>
                        <option value="state">State</option>
                        <option value="zipcode">ZIP Code</option>
                    </select>
                </p>
            </div>
            <div className="w-2/3">
                {sortBy === 'state' && <StateSelect onChange={(value) => handleSearch('state', value)} />}
                {sortBy === 'zipcode' && <DistanceSelect label="Theatres" onUpdate={(zipcode, miles) => {
                    handleSearch('zipcode', zipcode);
                    handleSearch('miles', miles.toString());
                }} />}
                {sortBy === 'name' && <Input onChange={(value) => handleSearch('name', value)} name="name" placeholder="Search by name..." />}
            </div>
        </section>
    )
}