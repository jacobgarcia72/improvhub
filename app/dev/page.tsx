'use client';
import Button from "@/components/form/button";
import Input from "@/components/form/input";
import { generateDummyTeams, generateDummyUsers } from "@/lib/dev-helpers";
import { useState } from "react";

export default function DevPage() {
    const [num, setNum] = useState('100');
    const [pending, setPending] = useState(false);
    return (
        <section className="flex flex-col items-center justify-center align-center gap-4">
            <Input type='number' name='number' value={num} onChange={setNum} />
            <Button caption="Create Dummy Users" disabled={pending} onClick={async () => {
                setPending(true);
                await generateDummyUsers(Number(num));
                setPending(false);
            }} />
            <Button caption="Create Dummy Teams" disabled={pending} onClick={async () => {
                setPending(true);
                await generateDummyTeams(Number(num));
                setPending(false);
            }} />
        </section>
    )
}