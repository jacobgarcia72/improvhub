'use client';
import { getTheatre } from "@/lib/theatres";
import Autocomplete from "./autocomplete";
import Input from "./input";
import { useEffect, useState } from "react";
import StateSelect from "./state-select";
import { Event, InputOptionObject } from "@/types";

export default function TheatreSelect({ existingShow }: {
    existingShow?: Event
}) {
    const [theatres, setTheatres] = useState<InputOptionObject[]>([]);
    const [city, setCity] = useState<string>(existingShow?.city || '');
    const [state, setState] = useState<string>(existingShow?.state || '');
    useEffect(() => {
        const fetchTheatres = async () => {
            const res = await fetch('/api/theatres');
            if (!res.ok) return;
            const ts: InputOptionObject[] = await res.json();
            setTheatres(ts);
        };
        fetchTheatres();
    }, []);

    const autoFillCityAndState = async (theatreName: string) => {
        const theatre = await getTheatre(theatreName);
        if (theatre) {
            setCity(theatre.city);
            setState(theatre.state)
        }
    }
    return (
        <div className="flex flex-row flex-wrap">
            <div className="w-[250px] pr-2">
                <Autocomplete
                    startingValue={existingShow?.theatre || undefined}
                    label="Theatre"
                    name="theatre"
                    options={theatres}
                    onChange={(value) => autoFillCityAndState(value as string)}
                />
            </div>
            <div className="w-[166px] pr-2">
                <Input label="City"
                    name="city"
                    value={city}
                    onChange={setCity}
                />
            </div>
            <StateSelect name="state" value={state} onChange={setState} />
        </div>
    )
}