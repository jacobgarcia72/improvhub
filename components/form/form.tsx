'use client';

import { useActionState } from 'react';
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

    return (
        <form action={formAction} className="flex flex-col gap-4 max-w-md mx-auto">
            {children}
            <Button caption={buttonCaption} />
            {formState?.message && <p>{formState.message}</p>}
        </form>
    )
}