'use client';

import { useState } from "react";
import DistanceSelect from "./distance-select";
import Autocomplete from "./autocomplete";
import { getTheatreNames, getTheatresByState } from "@/lib/theatres";
import StateSelect from "./state-select";
import { Theatre } from "@/types";

export default function SearchWithOptions({ onSearch }: { onSearch: (results: Theatre[]) => void }) {
    const [sortBy, setSortBy] = useState('name');

    const handleStateSearch = (state: string) => {
        onSearch(getTheatresByState(state));
    }
    
    return (
        <section className="w-full h-16 flex flex-row items-center justify-between px-6 py-3">
            <div className="w-1/3">
                <p>
                    Search by &nbsp;
                    <select
                        className="border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => setSortBy(e.currentTarget.value)}
                    >
                        <option value="name">Name</option>
                        <option value="state">State</option>
                        <option value="zipcode">ZIP Code</option>
                    </select>
                </p>
            </div>
            <div className="w-2/3">
                {sortBy === 'state' && <StateSelect onChange={handleStateSearch} />}
                {sortBy === 'zipcode' && <DistanceSelect label="Theatres" />}
                {sortBy === 'name' && <Autocomplete options={getTheatreNames()} />}
            </div>
        </section>
    )
}