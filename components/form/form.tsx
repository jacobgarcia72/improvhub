'use client';

import { useActionState } from 'react';
import FormSubmit from './form-submit';

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
        <form action={formAction} className="flex flex-col gap-4 max-w-md mx-auto mb-1">
            {children}
            <FormSubmit caption={buttonCaption} />
            {formState?.message && <p>{formState.message}</p>}
        </form>
    )
}