'use server';

import { redirect } from "next/navigation";
import { saveShow } from "./shows";
import { revalidatePath } from "next/cache";
import { Event, User } from "@/types";
import { saveUser } from "./users";
import { weekdayInitials } from "./dates";
import { theatres } from "./theatres";

export async function postShow(prevState: void | { message?: string }, formData: FormData) {
    let dates: string = '';
    let times: string = '';
    if (formData.get('tbd') === 'off') {
        if (formData.get('recurring') === 'on') {
            dates = `${weekdayInitials[Number(formData.get('weekday'))]}-${formData.get('cadence')}`;
            times = formData.get('regularTime') as string;
        } else {
            const totalShowings = Number(formData.get('showings'));
            for (let i = 0; i < totalShowings; i++) {
                dates += formData.get(`date-${i}`);
                times += formData.get(`time-${i}`);
                if (i < totalShowings - 1) {
                    dates += ','
                    times += ','
                }
            }
        }
    }

    let zipcode = formData.get('zipcode') as string;
    const theatre = formData.get('theatre') as string;
    if (theatre && !zipcode) zipcode = theatres.find((t) => t.name.toLowerCase() === theatre.toLowerCase())?.zipcode || '';


    const show: Event = {
        id: '',
        creatorId: '1', // TODO: Use actual userId
        title: formData.get('title') as string,
        theatre,
        zipcode,
        description: formData.get('description') as string,
        dates,
        times,
        price: Number(formData.get('price')),
        doorPrice: Number(formData.get('doorPrice')),
        webpage: formData.get('webpage') as string,
    }

    if (!show.title) return { message: 'Title is required' };

    const imageFile = formData.get('image') as File;

    const showId = await saveShow(show, imageFile);
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
