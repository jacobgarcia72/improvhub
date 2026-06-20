'use client'

import Autocomplete from "@/components/form/autocomplete";
import { capitalize, removeLeadingArticles } from "@/lib/helper-functions";
import { InputOption, InputOptionObject } from "@/types";
import { useEffect, useState } from "react";

export default function TheatreSearchBar({ search, onSearch }: { search?: string, onSearch: (value: string) => void }) {
    const [theatres, setTheatres] = useState<InputOptionObject[]>([]);
    useEffect(() => {
        const fetchTheatres = async () => {
            const res = await fetch('/api/theatres');
            if (!res.ok) return;
            const ts: InputOptionObject[] = await res.json();
            setTheatres(ts);
        };
        fetchTheatres();
    }, []);
    let startingValue: InputOption | null = null;
    if (search) {
        const searchText = search.replaceAll('+', ' ');
        startingValue = theatres.find((t) => (
            removeLeadingArticles(t.text.toLowerCase()) === removeLeadingArticles(searchText.toLowerCase())
        )) || capitalize(searchText);
    }
    return (
        <div className="w-[358px]">
            <Autocomplete
                startingValue={startingValue || undefined}
                onChange={(value) => onSearch(typeof value === 'string' ? value : value.text)}
                options={theatres}
                label="Theatre Name"
            />
        </div>
    )
}