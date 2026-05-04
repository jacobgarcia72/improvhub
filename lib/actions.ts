'use server';

import { redirect } from "next/navigation";
import { saveShow } from "./shows";
import { revalidatePath } from "next/cache";
import { EventFormData } from "@/types";

export async function postShow(prevState: void | { message?: string }, formData: FormData) {
    const show: EventFormData = {
        title: formData.get('title') as string,
        type: 'show',
        image: formData.get('image') as File,
        theatre: formData.get('theatre') as string,
        zipcode: Number(formData.get('zipcode')),
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        price: Number(formData.get('price')),
        doorPrice: Number(formData.get('door')),
        webpage: formData.get('webpage') as string,
    }

    if (!show.title) return { message: 'Title is required' };
    if (!(show.zipcode && `${show.zipcode}`.length === 5)) return { message: 'ZIP Code is required' };
    if (!show.date) return { message: 'Date is required' };
    if (!show.time) return { message: 'Time is required' };

    const showId = await saveShow(show);
    revalidatePath(`/shows/${showId}`);
    redirect(`/shows/${showId}`);
}
