'use client'
import Input from "@/components/form/input";
import { useState } from "react";

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
                {[...Array(Math.max(52, numberOfShowings))].map((x, index) => (
                    <div key={index} className="flex flex-row flex-wrap gap-4">
                        <div>
                            <Input label="Day" name="date" type="date" disabled={datesTBD} />
                        </div>
                        <div>
                            <Input label="Time" name="time" type="time" disabled={datesTBD} />
                        </div>
                    </div>
                ))}
            </>}
        </>
    )
}