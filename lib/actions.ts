'use server';

import { redirect } from "next/navigation";
import { saveShow } from "./shows";
import { revalidatePath } from "next/cache";
import { Event } from "@/types";

export async function postShow(prevState: { message?: string }, formData: FormData) {
    const show: Event = {
        title: formData.get('title') as string,
        type: 'show',
        theatre: formData.get('theatre') as string,
        address: formData.get('address') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        price: Number(formData.get('price')),
        doorPrice: Number(formData.get('door')),
        webpage: formData.get('webpage') as string,
    }

    if (!show.title) return { message: 'Title is required' };
    if (!show.address) return { message: 'Address is required' };
    if (!show.date) return { message: 'Date is required' };
    if (!show.time) return { message: 'Time is required' };

    const showId = await saveShow(show);
    console.log('Saved show with ID:', showId);
    revalidatePath(`/shows/${showId}`);
    redirect(`/shows/${showId}`);
}
