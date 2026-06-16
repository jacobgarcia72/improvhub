'use client';
import { getTheatreByName, getTheatreNames } from "@/lib/theatres";
import Autocomplete from "./autocomplete";
import Input from "./input";
import { useState } from "react";
import StateSelect from "./state-select";
import { Event } from "@/types";

export default function TheatreSelect({ existingShow }: {
    existingShow?: Event
}) {
    const [city, setCity] = useState<string>(existingShow?.city || '');
    const [state, setState] = useState<string>(existingShow?.state || '');
    const theatreNames = getTheatreNames();

    const autoFillCityAndState = (theatreName: string) => {
        const theatre = getTheatreByName(theatreName);
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
                    options={theatreNames}
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