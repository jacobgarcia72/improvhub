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
        <div className="flex flex-row gap-4 flex-wrap">
            <div>
                <Autocomplete label="Theatre" name="theatre" options={theatreNames} onChange={(value) => autofillZipcode(value)} />
            </div>
            <div>
                <Input label="ZIP Code" name="zipcode" required type='zipcode' value={zipcode} />
            </div>
        </div>
    )
}