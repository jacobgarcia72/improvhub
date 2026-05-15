'use client';
import { getTheatreByName, getTheatreNames } from "@/lib/theatres";
import Autocomplete from "./autocomplete";
import Input from "./input";
import { useState } from "react";

export default function TheatreSelect() {
    const [zipcode, setZipcode] = useState('');
    const theatreNames = getTheatreNames();

    const autofillZipcode = (theatreName: string) => {
        const theatre = getTheatreByName(theatreName);
        if (theatre) {
            setZipcode(theatre.zipcode);
        }
    }
    return (
        <div className="flex flex-row flex-wrap">
            <div className="w-3/5 pr-2">
                <Autocomplete label="Theatre" name="theatre" options={theatreNames} onChange={(value) => autofillZipcode(value)} />
            </div>
            <div className="w-2/5">
                <Input label="ZIP Code" name="zipcode" type='zipcode' value={zipcode} />
            </div>
        </div>
    )
}