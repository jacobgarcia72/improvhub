'use client';

import ImagePicker from '@/components/image-picker';
import { postShow } from '@/lib/actions';
import { useActionState } from 'react';

const initialState = {
    message: '',
}

export default function NewShowPage() {
    const [formState, formAction] = useActionState(postShow, initialState);

    return (
        <main className="px-4 py-6">
            <form action={formAction} className="flex flex-col gap-4 max-w-md mx-auto">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" />
                <ImagePicker />
                <label htmlFor="theatre">Theatre</label>
                <input type="text" name="theatre" />
                <label htmlFor="address">Address</label>
                <input type="text" name="address" />
                <label htmlFor="description">Description</label>
                <textarea name="description" rows={3} />
                <div className="flex flex-row gap-4">
                    <div>
                        <label htmlFor="date">Day</label>
                        <input type="date" name="date" />
                    </div>
                    <div>
                        <label htmlFor="time">Time</label>
                        <input type="time" name="time" />
                    </div>
                </div>
                <div className="flex flex-row gap-4">
                    <div>
                        <label htmlFor="price">Ticket Price</label>
                        <input type="number" name="price" />
                    </div>
                    <div>
                        <label htmlFor="door">Price at Door</label>
                        <input type="number" name="door" />
                    </div>
                </div>
                <label htmlFor="webpage">Webpage</label>
                <input type="url" name="webpage" />
                {formState.message && <p>{formState.message}</p>}
                <button type="submit">
                    Create Show
                </button>
            </form>
        </main>
    )
}