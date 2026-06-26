'use client';

import { useActionState } from 'react';
import FormSubmit from './form-submit';

const initialState = {
    message: '',
}

export default function Form({ children, buttonCaption = 'Submit', onSubmit, cancel, className, smallButtons }: {
    children: React.ReactNode,
    buttonCaption?: string,
    onSubmit: (prevState: void | { message?: string }, formData: FormData) => Promise<{ message?: string } | void>
    className?: string,
    cancel?: () => void,
    smallButtons?: boolean
}) {
    const [formState, formAction] = useActionState(onSubmit, initialState);

    return (
        <form action={formAction} className={`${className} flex flex-col ${className?.includes('gap-') ? '' : `gap-4`} mx-auto mb-1`}>
            {children}
            <div className='flex flex-col'>
                <FormSubmit caption={buttonCaption} cancel={cancel} smallButtons={smallButtons || false} />
                {formState?.message && <p className='text-red-600 text-sm'>{formState.message}</p>}
            </div>
        </form>
    )
}