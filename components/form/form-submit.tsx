'use client';

import { useFormStatus } from "react-dom";
import Button from "./button";

export default function FormSubmit({ caption = 'Submit' }: { caption?: string, disabled?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <div className="my-2 w-full flex flex-col">
            <Button
                submit
                caption={pending ? 'Pending...' : caption}
                disabled={pending}
            />
        </div>
    )
}