'use server';

import { redirect } from "next/navigation";
import { saveShow } from "./shows";
import { revalidatePath } from "next/cache";
import { Candence, Event, User, WeekdayInitial } from "@/types";
import { saveUser } from "./users";
import { weekdayInitials } from "./dates";
import { theatres } from "./theatres";
import { removeLeadingArticles } from "./helper-functions";

export async function postShow(prevState: void | { message?: string }, formData: FormData) {
    const title = (formData.get('title') as string)?.trim() || null;
    if (!title) return { message: 'Title is required' };

    const ticketsUrl = (formData.get('ticketsUrl') as string)?.trim() || null;
    if (ticketsUrl) {
        const isValid = URL.canParse(ticketsUrl);
        if (!isValid) return { message: 'Tickets link must be a valid URL' };
    }

    let dateTimes: string[] | null = null;
    let recurringDay: WeekdayInitial | null = null;
    let recurringTime: string | null = null;
    let cadence: Candence | null = null;
    if (!formData.get('tbd')) {
        if (formData.get('recurring')) {
            recurringDay = weekdayInitials[Number(formData.get('weekday'))];
            cadence = formData.get('cadence') as Candence;
            recurringTime = formData.get('regularTime') as string;
        } else {
            const totalShowings = Number(formData.get('showings'));
            dateTimes = [];
            for (let i = 0; i < totalShowings; i++) {
                dateTimes.push(
                    `${formData.get(`date-${i}`)} ${formData.get(`time-${i}`)}`
                );
            }
        }
    }

    let zipcode = (formData.get('zipcode') as string)?.trim() || null;
    const theatre = (formData.get('theatre') as string)?.trim() || null;
    if (theatre && !zipcode) zipcode = theatres.find((t) => (
        removeLeadingArticles(t.name.toLowerCase()) === removeLeadingArticles(theatre.toLowerCase())
    ))?.zipcode || null;


    const price = formData.get('price');
    const doorPrice = formData.get('doorPrice');

    const runtimeHours = Number(formData.get('runtimeHours'));
    const runtimeMinutes = Number(formData.get('runtimeMinutes'));
    let runtime: string | null = null;
    if (runtimeHours || runtimeMinutes) {
        runtime = `${runtimeHours}h${runtimeMinutes}`;
    }

    const photoCredit = (formData.get('photoCredit') as string)?.trim() || null;
    const notes = (formData.get('notes') as string)?.trim() || null;

    let description = formData.get('description') as string || null;
    if (description) description = description.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\r/g, '<br>');

    const show: Event = {
        id: '',
        creatorId: '1', // TODO: Use actual userId
        title,
        image: null,
        photoCredit,
        theatre,
        zipcode,
        description,
        dateTimes: dateTimes ? dateTimes.join(',') : null,
        recurringDay,
        recurringTime,
        cadence,
        runtime,
        price: price === '' ? null : Number(price),
        doorPrice: doorPrice === '' ? null : Number(doorPrice),
        ticketsUrl,
        notes
    }

    const imageFile = formData.get('image') as File || null;

    const showId = await saveShow(show, imageFile);
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
