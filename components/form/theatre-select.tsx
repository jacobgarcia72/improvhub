'use client';
import Autocomplete from "./autocomplete";
import Input from "./input";
import { useEffect, useState } from "react";
import StateSelect from "./state-select";
import { Event, InputOptionObject, Theatre } from "@/types";

export default function TheatreSelect({ existingEvent }: {
    existingEvent?: Event
}) {
    const [theatres, setTheatres] = useState<InputOptionObject[]>([]);
    const [city, setCity] = useState<string>(existingEvent?.city || '');
    const [state, setState] = useState<string>(existingEvent?.state || '');
    useEffect(() => {
        const fetchTheatres = async () => {
            const res = await fetch('/api/theatres');
            if (!res.ok) return;
            const ts: InputOptionObject[] = await res.json();
            setTheatres(ts);
        };
        fetchTheatres();
    }, []);

    const autoFillCityAndState = async (theatre: string) => {
        const res = await fetch(`/api/theatre?idOrName=${encodeURIComponent(theatre)}`);
        if (!res.ok) return;
        const foundTheatre: Theatre | null = await res.json();
        if (foundTheatre) {
            setCity(foundTheatre.city);
            setState(foundTheatre.state)
        }
    }
    return (
        <div className="flex flex-row flex-wrap">
            <div className="w-[250px] pr-2">
                <Autocomplete
                    startingValue={existingEvent?.theatre || undefined}
                    label="Theatre / Venue"
                    name="theatre"
                    options={theatres}
                    onChange={(value) => {
                        if (typeof value !== 'string') {
                            autoFillCityAndState(value.id.toString());
                        }
                    }}
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