'use client';

import Checkbox from "@/components/form/checkbox";
import Input from "@/components/form/input";
import InputList from "@/components/form/input-list";
import StateSelect from "@/components/form/state-select";
import { getTheatreNames, getTheatresByCity } from "@/lib/theatres";
import { User } from "@/types";
import { useState } from "react";

export default function LocationInputs({ cityCaption, theatreCaption, user }: {
    cityCaption?: string;
    theatreCaption?: string;
    user?: User;
}) {
    const [city, setCity] = useState<string>( user?.city || '');
    const [state, setState] = useState<string>(user?.state || '');
    const [nearbyTheatres, setNearbyTheatres] = useState<string[]>(
        (user?.city && user?.state) ? getTheatresByCity(user.city, user.state, 0).map((t) => t.name) : []
    );
    
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

    const inputTheatres = user?.theatres ? (
        user.theatres.filter((theatre) => !nearbyTheatres.includes(theatre))
    ) : [];
    return <div>
        {cityCaption && <p className="label mb-2 mt-1">{cityCaption}</p>}
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
            {theatreCaption && <p className="label mb-1">{theatreCaption}</p>}
            <ul>
                {nearbyTheatres.map((theatre, i) => (
                    <li key={i} className="m-3">
                        <Checkbox
                            name={`theatre-${i}`}
                            label={theatre}
                            value={theatre}
                            defaultChecked={user?.theatres?.includes(theatre)}
                        />
                    </li>
                ))}
            </ul>
            <InputList
                startingOptions={inputTheatres}
                options={getTheatreNames()}
                name="added-theatre"
                addLabel="Theatre"  />
        </div>
    </div>
}