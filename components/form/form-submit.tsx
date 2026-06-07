'use client';

import { useFormStatus } from "react-dom";
import Button from "./button";

export default function FormSubmit({ caption = 'Submit', cancel }: { caption?: string, disabled?: boolean, cancel?: () => void }) {
    const { pending } = useFormStatus();
    return (
        <div className="my-2 w-full flex flex-row">
            <Button
                className={cancel ? '' : "w-full"}
                submit
                caption={pending ? 'Pending...' : caption}
                disabled={pending}
            />
            {cancel && <Button
                style="link"
                caption="Cancel"
                onClick={cancel}
            />}
        </div>
    )
}