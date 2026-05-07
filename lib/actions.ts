'use server';

import { redirect } from "next/navigation";
import { saveShow } from "./shows";
import { revalidatePath } from "next/cache";
import { EventFormData, User } from "@/types";
import { saveUser } from "./users";

export async function postShow(prevState: void | { message?: string }, formData: FormData) {
    const show: EventFormData = {
        title: formData.get('title') as string,
        type: 'show',
        image: formData.get('image') as File,
        theatre: formData.get('theatre') as string,
        zipcode: formData.get('zipcode') as string,
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

export async function createUser(prevState: void | { message?: string }, formData: FormData) {
    const imageFile = formData.get('image') as File;
    const user: User = {
        id: '',
        username: formData.get('username') as string || '',
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        pronouns: formData.get('pronouns') as string,
        headline: formData.get('headline') as string,
        bio: formData.get('bio') as string,
        theatre: formData.get('theatreId') as string,
        secondaryTheatre: formData.get('secondaryTheatreId') as string,
        gender: formData.get('gender') as string,
        orientation: formData.get('orientation') as string,
        ethnicity: formData.get('ethnicity') as string,
        website: formData.get('website') as string,
        experience: formData.get('experience') as string,
        teams: ''
    }
    if (!user.firstName) return { message: 'First Name is required' };

    const username = await saveUser(user, imageFile);
    revalidatePath(`/profile/${username}`);
    redirect(`/profile/${username}`);
}
