'use client'

import { useState } from "react";
import Autocomplete from "./autocomplete";
import Button from "./button";
import Input from "./input";

export default function InputList({ name, options }: {
    name: string;
    options?: string[]
}) {
    const [addedInputs, setAddedInputs] = useState<boolean[]>([]);

    return (
        <div className="grid gap-2 w-full mt-3">
            {addedInputs.map((input, i) => (
                options?.length ? (
                    <Autocomplete key={i} options={options} name={`added-${name}-${i}`} />
                ) : (
                    <Input key={i} name={`added-${name}-${i}`} /> 
                )
            ))}
            <div className="flex flex-row">
                <Button onClick={() => setAddedInputs([...addedInputs, true])} caption="Add" className="w-26" />
                {addedInputs.length > 0 && <Button onClick={() => setAddedInputs([...(addedInputs.slice(0, addedInputs.length - 1))])} style="link" caption="Remove" />}
            </div>
        </div>
    )
}