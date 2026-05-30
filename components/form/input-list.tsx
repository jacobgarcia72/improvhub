'use client'

import { useState } from "react";
import Autocomplete from "./autocomplete";
import Button from "./button";
import Input from "./input";
import { InputOption } from "@/types";

export default function InputList({ name, options, label, addLabel, startingOptions }: {
    name: string;
    label?: string;
    addLabel?: string;
    options?: InputOption[]
    startingOptions?: InputOption[]
}) {
    const [addedInputs, setAddedInputs] = useState<(InputOption | null)[]>(startingOptions || []);
    const [availableOptions, setAvailableOptions] = useState<InputOption[] | undefined>((
        startingOptions ? options?.filter((option) => !startingOptions.includes(option)) : options
    ));

    const updateInput = (value: InputOption, i: number) => {
        const inputs = [...addedInputs];
        inputs[i] = value;
        setAddedInputs(inputs);
        if (!options) return;
        setAvailableOptions(options?.filter((option) => !addedInputs.includes(option) && option !== value));
    }

    return (
        <div className="">
            {label && <p className="label">{label}</p>}
            <div className="grid gap-2 w-full">
                {addedInputs.map((input, i) => (
                    availableOptions?.length ? (
                        <Autocomplete key={i}
                            options={availableOptions}
                            name={`${name}-${i}`}
                            placeholder={addLabel}
                            onChange={(value) => updateInput(value, i)}
                            startingValue = {startingOptions?.[i] || undefined}
                        />
                    ) : (
                        <Input key={i}
                            name={`${name}-${i}`}
                            placeholder={addLabel}
                            onChange={(value) => updateInput(value, i)}
                        /> 
                    )
                ))}
            </div>
            <div className="flex flex-row mt-2">
                <Button onClick={() => setAddedInputs([...addedInputs, null])} caption={`Add${addLabel ? ` ${addLabel}` : ''}`} className="min-w-26" />
                {addedInputs.length > 0 && <Button onClick={() => setAddedInputs([...(addedInputs.slice(0, addedInputs.length - 1))])} style="link" caption="Remove" />}
            </div>
        </div>
    )
}