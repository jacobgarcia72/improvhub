'use client';
import { getTheatreByName, getTheatreNames } from "@/lib/theatres";
import Autocomplete from "./autocomplete";
import Input from "./input";
import { useState } from "react";
import StateSelect from "./state-select";

export default function TheatreSelect() {
    const [city, setCity] = useState<string>('');
    const [state, setState] = useState<string>();
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
                <Autocomplete label="Theatre" name="theatre" options={theatreNames} onChange={(value) => autoFillCityAndState(value)} />
            </div>
            <div className="w-[186px] pr-2">
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