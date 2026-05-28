'use client'

import { useState } from "react";
import Autocomplete from "./autocomplete";
import Button from "./button";
import Input from "./input";

export default function InputList({ name, options, label, addLabel }: {
    name: string;
    label?: string;
    addLabel?: string;
    options?: string[]
}) {
    const [addedInputs, setAddedInputs] = useState<boolean[]>([]);

    return (
        <div className="">
            {label && <p className="label">{label}</p>}
            <div className="grid gap-2 w-full">
                {addedInputs.map((input, i) => (
                    options?.length ? (
                        <Autocomplete key={i} options={options} name={`added-${name}-${i}`} placeholder={addLabel} />
                    ) : (
                        <Input key={i} name={`added-${name}-${i}`} placeholder={addLabel} /> 
                    )
                ))}
            </div>
            <div className="flex flex-row mt-2">
                <Button onClick={() => setAddedInputs([...addedInputs, true])} caption={`Add${addLabel ? ` ${addLabel}` : ''}`} className="min-w-26" />
                {addedInputs.length > 0 && <Button onClick={() => setAddedInputs([...(addedInputs.slice(0, addedInputs.length - 1))])} style="link" caption="Remove" />}
            </div>
        </div>
    )
}