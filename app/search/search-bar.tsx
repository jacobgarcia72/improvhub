'use client';

import { useState } from "react";
import DistanceSelect from "@/components/form/distance-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import TheatreSearchBar from "./theatre-search-bar";
import { formatDate } from "@/lib/dates";
import { Theatre } from "@/types";

const eventSearchTypes = ['all', 'classes', 'jams', 'shows', 'workshops'];

export default function SearchBar({ theatres: userTheatres }: { theatres?: (Theatre | string)[] }) {
    const searchTypes = ['theatre', 'location', 'miles'];
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const searchFor = searchParams.get('for');

    const theatreValues = searchParams.getAll('theatre').map((value) => value.trim()).filter(Boolean);
    const theatre = theatreValues[0] || '';
    const location = searchParams.get('location')?.trim() || '';
    const miles = searchParams.get('miles')?.trim() || '';
    const startDate = searchParams.get('startDate')?.trim() || formatDate(new Date());
    const showStartDate = searchFor ? eventSearchTypes.includes(searchFor) : false;
    const userTheatreValues = userTheatres?.map((t) => typeof t === 'string' ? t : t.id) || [];
    const [searchBy, setSearchBy] = useState(() => {
        if (theatreValues.length > 1 && theatreValues.every((value) => userTheatreValues.includes(value))) return 'my-theatres';
        if (theatreValues.length === 1 && userTheatreValues.includes(theatreValues[0])) return theatreValues[0];
        if (theatre) return 'theatre';
        if (location) return 'location';
        return ''
    });

    const handleSearchFor = (searchFor: string) => {
        replace(pathname);
        params.delete('limit');
        if (searchFor) {
            params.set('for', searchFor);
            if (!eventSearchTypes.includes(searchFor)) params.delete('startDate');
            replace(`${pathname}?${params.toString()}`);
        }
    }

    const handleSearch = (type: string, term: string | string[]) => {
        params.delete('limit');
        if (Array.isArray(term)) {
            params.delete(type);
            term.forEach((value) => {
                if (value) params.append(type, value);
            });
        } else if (term) {
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
                return <TheatreSearchBar search={theatre} onSearch={(value) => handleSearch('theatre', value)} />
            default:
                return null;
        }
    }
    
    return (
        <section className="max-w-[1280px]! flex flex-wrap gap-2">
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
                    <option value="all">All Events</option>
                    <option value="classes">Classes</option>
                    <option value="coaches">Coaches</option>
                    <option value="jams">Jams</option>
                    <option value="musicians">Musicians</option>
                    <option value="shows">Shows</option>
                    {/* <option value="performers">Performers</option> */}
                    <option value="troupes">Troupes</option>
                    <option value="theatres">Theatres</option>
                    <option value="workshops">Workshops</option>
                </select>
            </div>
            <div className="flex-1 min-w-[140px] max-w-[200px]">
                <label htmlFor="searchBy">Search By</label>
                <select
                    value={searchBy}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setSearchBy(value);
                        searchTypes.forEach((type) => params.delete(type))
                        params.delete('limit');
                        if (value === 'my-theatres') {
                            userTheatreValues.forEach((theatre) => params.append('theatre', theatre));
                        } else if (value && !searchTypes.includes(value)) {
                            params.set('theatre', value);
                        }
                        replace(`${pathname}?${params.toString()}`);
                    }}
                >
                    <option value=""></option>
                    <option value="location">Location</option>
                    <option value="theatre">Theatre Name</option>
                    {userTheatres?.length ? <>
                        {userTheatres.length > 1 ? (
                            <option value="my-theatres">My Theatres</option>
                        ) : null}
                        {searchFor === 'theatres' ? null : userTheatres.map((t, i) => <option key={i} value={typeof t === 'string' ? t : t.id}>{typeof t === 'string' ? t : t.name}</option>)}
                    </> : null}
                </select>
            </div>
            {SearchParams()}
            {showStartDate ? (
                <div className="flex-1 min-w-[120px] max-w-[200px]">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        onChange={(e) => handleSearch('startDate', e.currentTarget.value)}
                    />
                </div>
            ) : null}
        </section>
    )
}
