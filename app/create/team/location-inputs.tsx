'use client';

import Checkbox from "@/components/form/checkbox";
import Input from "@/components/form/input";
import InputList from "@/components/form/input-list";
import StateSelect from "@/components/form/state-select";
import { getTheatreNames, getTheatresByCity } from "@/lib/theatres";
import { useState } from "react";

export default function LocationInputs() {
    const [city, setCity] = useState<string>('');
    const [state, setState] = useState<string>();
    const [nearbyTheatres, setNearbyTheatres] = useState<string[]>([]);
    
    const [delay, setDelay] = useState<NodeJS.Timeout>();

    const getNearbyTheatres = (city: string, state?: string) => {
        clearTimeout(delay);
        setDelay(
            setTimeout(() => {
                let theatres: string[] = [];
                if (city && state) {
                    theatres = getTheatresByCity(city, state, 0).map((t) => t.name);
                }
                setNearbyTheatres(theatres);
            }, 100)
        )
    }

    return <div>
        <p className="label mb-2 mt-1">Where is your team based?</p>
        <div className="flex flex-row flex-wrap">
            <div className="w-[186px] pr-2">
                <Input label="City"
                    name="city"
                    value={city}
                    onChange={(value) => {
                        setCity(value);
                        getNearbyTheatres(value, state);
                    }}
                />
            </div>
            <StateSelect
                name="state"
                value={state}
                onChange={(value) => {
                    setState(value);
                    getNearbyTheatres(city, value);
                }}
            />
        </div>
        <div className="mt-4">
            <p className="label mb-1">Where does your team perform (or hope to perform)?</p>
            <ul>
                {nearbyTheatres.map((theatre, i) => (
                    <li key={i} className="m-3">
                        <Checkbox name={`theatre-${i}`} label={theatre} />
                    </li>
                ))}
            </ul>
            <InputList options={getTheatreNames()} name="added-theatre"  />
        </div>
    </div>
}