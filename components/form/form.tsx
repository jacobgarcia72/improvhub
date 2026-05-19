'use client';

import { useActionState, useState } from 'react';
import Button from './button';

const initialState = {
    message: '',
}

export default function Form({ children, buttonCaption = 'Submit', onSubmit }: {
    children: React.ReactNode,
    buttonCaption?: string,
    onSubmit: (prevState: void | { message?: string }, formData: FormData) => Promise<{ message?: string } | void>
}) {
    const [formState, formAction] = useActionState(onSubmit, initialState);
    const [ pending, setPending ] = useState(false);
    console.log(pending, formState)

    return (
        <form action={formAction} onSubmit={() => setPending(true)} className="flex flex-col gap-4 max-w-md mx-auto mb-1">
            {children}
            <div className="my-2 w-full flex flex-col">
                <Button caption={pending ? 'Pending...' : buttonCaption} disabled={pending} />
            </div>
            {formState?.message && <p>{formState.message}</p>}
        </form>
    )
}