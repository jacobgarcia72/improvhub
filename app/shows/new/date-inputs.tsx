'use client'
import Button from "@/components/form/button";
import Input from "@/components/form/input";
import { useState } from "react";

function DateAndTime({ label = 'Day', index = 0 }) {
    return (
        <div className="flex flex-row flex-wrap gap-4">
            <div>
                <Input label={label} name={`date-${index}`} type="date" />
            </div>
            <div>
                <Input label="Time" name={`time-${index}`} type="time" />
            </div>
        </div>
    )
}

export default function DateInputs() {
    const [datesTBD, setDatesTBD] = useState<boolean>(false);
    const [numberOfShowings, setNumberOfShowings] = useState<number>(1);
    return (
        <>
            <div>
                <input
                    name="tbd"
                    type="checkbox"
                    id="tbd"
                    className="mr-1"
                    onChange={(e) => setDatesTBD(e.target.checked)}
                />
                <label htmlFor="tbd">Dates TBD</label>
            </div>
            {!datesTBD && <>
                <Input type="number"
                    name="showings"
                    label="Number of Showings"
                    value={`${numberOfShowings}`}
                    onChange={(value) => setNumberOfShowings(Number(value))}
                    min={1}
                    max={52}
                />
                <DateAndTime label={numberOfShowings > 1 ? 'Showing #1' : 'Date'} />
                {numberOfShowings > 1 && <>
                    <div className="flex flex-row">
                        <p>Autofill:</p>
                        <select>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                        <Button caption="Go" />
                    </div>
                    {[...Array(Math.min(52, numberOfShowings - 1))].map((x, index) => (
                        <DateAndTime key={index} label={`Showing #${index + 2}`} />
                    ))}
                </>}
            </>}
        </>
    )
}