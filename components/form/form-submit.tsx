'use client';

import { useFormStatus } from "react-dom";
import Button from "./button";

export default function FormSubmit({ caption = 'Submit', cancel, smallButtons }: { caption?: string, disabled?: boolean, cancel?: () => void, smallButtons?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <div className={`${smallButtons ? 'my-0' : 'my-2'} w-full flex flex-row`}>
            <Button
                className={smallButtons ? 'w-24 small' : 'w-48'}
                submit
                caption={pending ? 'Pending...' : caption}
                disabled={pending}
            />
            {cancel && <Button
                style="link"
                caption="Cancel"
                onClick={cancel}
                disabled={pending}
            />}
        </div>
    )
}