'use client';

import Button from "@/components/form/button";
import Input from "@/components/form/input";
import nameGenerator from "@/lib/name-generator";
import { useState } from "react";

export default function TroupeNameInput({ value = '' }: { value?: string }) {
    const [name, setName] = useState(value);
    return (
        <div className="flex flex-row items-end">
            <div className="w-[calc(100%-98px)] pr-2">
                <Input required name="name" label="Troupe Name" onChange={setName} value={name} autocomplete={false} />
            </div>
            <div className="w-[80px]">
                <Button caption="Random" onClick={() => setName(nameGenerator())} />
            </div>
        </div>
    )
}
