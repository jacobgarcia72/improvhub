'use client';

import Button from "@/components/form/button";
import Input from "@/components/form/input";
import nameGenerator from "@/lib/name-generator";
import { useState } from "react";

export default function NameInput() {
    const [name, setName] = useState('');
    return (
        <div className="flex flex-row items-end">
            <div className="w-4/5 pr-2">
                <Input name="name" label="Team Name" onChange={setName} value={name} autocomplete={false} />
            </div>
            <div className="w-1/5">
                <Button type="button" caption="Random" onClick={() => setName(nameGenerator())} />
            </div>
        </div>
    )
}