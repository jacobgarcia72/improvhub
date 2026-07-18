'use client'

import { useRef, useState } from "react";
import Autocomplete from "./autocomplete";
import Button from "./button";
import Input from "./input";
import XButton from "./x";
import { InputOption } from "@/types";

export default function InputList({ name, options, label, addLabel, startingOptions }: {
    name: string;
    label?: string;
    addLabel?: string;
    options?: InputOption[]
    startingOptions?: InputOption[]
}) {
    const startingInputs = startingOptions?.map((option, i) => ({ key: i, value: option })) || [];
    const nextKey = useRef(startingOptions?.length || 0);
    const [addedInputs, setAddedInputs] = useState<{ key: number, value: InputOption | null }[]>(startingInputs);

    const updateInput = (value: InputOption, i: number) => {
        const inputs = [...addedInputs];
        inputs[i] = { ...inputs[i], value };
        setAddedInputs(inputs);
    }

    const addInput = () => {
        setAddedInputs([...addedInputs, { key: nextKey.current, value: null }]);
        nextKey.current++;
    }

    const removeInput = (key: number) => {
        setAddedInputs(addedInputs.filter((input) => input.key !== key));
    }

    return (
        <div className="">
            {label && <p className="label">{label}</p>}
            <div className="grid gap-2 w-full">
                {addedInputs.map((input, i) => (
                    <div key={input.key} className="flex items-center gap-2">
                        {options?.length ? (
                            <Autocomplete
                                options={options?.filter((option) => (
                                    !addedInputs.find((input) => typeof input.value !== 'string' && typeof option !== 'string' && input.value?.id === option.id)
                                ))}
                                name={`${name}-${i}`}
                                placeholder={addLabel}
                                onChange={(value) => updateInput(value, i)}
                                startingValue={input.value || undefined}
                            />
                        ) : (
                            <Input
                                name={`${name}-${i}`}
                                placeholder={addLabel}
                                value={typeof input.value === 'string' ? input.value : undefined}
                                onChange={(value) => updateInput(value, i)}
                            />
                        )}
                        <XButton onClick={() => removeInput(input.key)} />
                    </div>
                ))}
            </div>
            <div className="flex flex-row">
                <Button onClick={addInput} caption={`Add${addLabel ? ` ${addLabel}` : ''}`} style="link" className="min-w-26" />
            </div>
        </div>
    )
}
