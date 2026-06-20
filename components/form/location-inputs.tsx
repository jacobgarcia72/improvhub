'use client';

import Checkbox from "@/components/form/checkbox";
import Input from "@/components/form/input";
import InputList from "@/components/form/input-list";
import StateSelect from "@/components/form/state-select";
import { InputOption, InputOptionObject, Theatre, User } from "@/types";
import { useEffect, useState } from "react";
import Loader from "../loader";

type LocationDefaults = {
    city?: string | null;
    state?: string | null;
    theatres?: string[];
};

export default function LocationInputs({ cityCaption, theatreCaption, user, defaults }: {
    cityCaption?: string;
    theatreCaption?: string;
    user?: User;
    defaults?: LocationDefaults;
}) {
    const locationDefaults = defaults || user;
    const [city, setCity] = useState<string>(locationDefaults?.city || '');
    const [state, setState] = useState<string>(locationDefaults?.state || '');
    const [theatres, setTheatres] = useState<InputOptionObject[]>([]);
    const [nearbyTheatres, setNearbyTheatres] = useState<InputOptionObject[]>([]);
    const [inputTheatres, setInputTheatres] = useState<InputOption[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTheatres = async () => {
            const res = await fetch('/api/theatres');
            if (!res.ok) return;
            const ts: InputOptionObject[] = await res.json();
            setTheatres(ts);
            if (locationDefaults?.city && locationDefaults?.state) {
                const {city, state} = locationDefaults;
                const res = await fetch(`/api/theatres?city=${city}&state=${state}`);
                if (!res.ok) return;
                const tsInCity: Theatre[] = await res.json();
                setNearbyTheatres(tsInCity.map(({ name, id, image }) => ({ text: name, id, image })));
                const theatresNotIncludedInCheckboxes = locationDefaults?.theatres ? (
                    locationDefaults.theatres.filter((value) => !tsInCity.find(t => t.id === value || t.name === value))
                ) : []
                const inputTs: InputOption[] = [];
                for (let i = 0; i < theatresNotIncludedInCheckboxes.length; i++) {
                    const t = theatresNotIncludedInCheckboxes[i];
                    const res = await fetch(`/api/theatre?idOrName=${t}`);
                    if (!res.ok) return;
                    const foundTheatre: Theatre | null = await res.json();
                    const input: InputOption = foundTheatre ? ({ text: foundTheatre.name, id: foundTheatre.id, image: foundTheatre.image }) : t;
                    inputTs.push(input);
                }
                setInputTheatres(inputTs);
            }
            setLoading(false);
        };
        fetchTheatres();
    }, [locationDefaults]);
    
    const [delay, setDelay] = useState<NodeJS.Timeout>();

    const getNearbyTheatres = (city: string, state?: string) => {
        clearTimeout(delay);
        setDelay(
            setTimeout(async () => {
                let theatres: InputOptionObject[] = [];
                if (city && state) {
                    const res = await fetch(`/api/theatres?city=${city}&state=${state}`);
                    if (!res.ok) return;
                    theatres = (await res.json() as Theatre[]).map(({ name, id, image }) => ({ text: name, id, image }));
                }
                setNearbyTheatres(theatres);
            }, 100)
        )
    }

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
        {loading ? <Loader/> : (
            <div className="mt-4">
                {theatreCaption && <p className="label mb-1">{theatreCaption}</p>}
                <ul>
                    {nearbyTheatres.map((theatre, i) => (
                        <li key={i} className="m-3">
                            <Checkbox
                                name={`theatre-${i}`}
                                label={theatre.text}
                                value={theatre.id.toString()}
                                defaultChecked={Boolean(locationDefaults?.theatres?.find(t => t === theatre.id || t === theatre.text))}
                            />
                        </li>
                    ))}
                </ul>
                <InputList
                    startingOptions={inputTheatres}
                    options={theatres}
                    name="added-theatre"
                    addLabel="Theatre"  />
            </div>
        )}
    </div>
}
