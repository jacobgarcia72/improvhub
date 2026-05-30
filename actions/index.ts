'use server';
import slugify from 'slugify';
import { redirect } from "next/navigation";
import { saveShow } from "@/lib/shows";
import { Candence, Event, WeekdayInitial } from "@/types";
import { sortDates, weekdayInitials } from "@/lib/dates";
import { theatres } from "@/lib/theatres";
import { removeLeadingArticles } from "@/lib/helper-functions";
import { Team } from '@/types';
import { uploadImage } from '@/lib/cloudinary';
import { saveTeam } from '@/lib/teams';

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
            dateTimes = sortDates(dateTimes);
        }
    }

    let city = (formData.get('city') as string)?.trim() || null;
    let state = (formData.get('state') as string)?.trim() || null;
    const theatre = (formData.get('theatre') as string)?.trim() || null;

    if (theatre && (!city || !state)) {
        const matchingTheatre = theatres.find((t) => (
            removeLeadingArticles(t.name.toLowerCase()) === removeLeadingArticles(theatre.toLowerCase())
        ));
        if (matchingTheatre) {
            if (!city) city = matchingTheatre.city;
            if (!state) state = matchingTheatre.state;
        }
    }

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
        city,
        state,
        description,
        dateTimes,
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

export async function postTeam(prevState: void | { message?: string }, formData: FormData) {
    const name = (formData.get('name') as string)?.trim() || null;
    if (!name) return { message: 'Team name is required' };
    
    const imageFile = formData.get('image') as File;
    let imageUrl = '';
    if (imageFile && imageFile.size) {
        if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
            return { message: 'Image file size exceeds 5MB limit' };
        }
        try {
            imageUrl = await uploadImage(imageFile, 'teams');
        } catch {
            throw new Error('Image upload failed');
        }
    }

    let description = formData.get('description') as string || null;
    if (description) description = description.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\r/g, '<br>');

    const data = Object.fromEntries(formData.entries());

    const checkedTheatres = Object.keys(data)
        .filter(key => key.startsWith('theatre-') && Boolean((data[key] as string).trim()))
        .map(key => data[key] as string);

    const addedTheatres = Object.keys(data)
        .filter(key => key.startsWith('added-theatre-') && Boolean((data[key] as string).trim()))
        .map(key => data[key] as string);

    const theatres = [...new Set(checkedTheatres.concat(addedTheatres))];

    const team: Team = {
        id: slugify(name, { lower: true, trim: true }),
        admins: [data.creator as string],
        name,
        image: imageUrl,
        photoCredit: formData.get('photoCredit') as string || null,
        city: formData.get('city') as string || null,
        state: formData.get('state') as string || null,
        theatres,
        players: [data.creator as string],
        lookingForPlayers: Boolean(formData.get('lookingForPlayers')),
        coach: null,
        lookingForCoach: Boolean(formData.get('lookingForCoach')),
        musician: null,
        lookingForMusician: Boolean(formData.get('lookingForMusician')),
        description,
    }
    const playerInvitations = Object.keys(data)
        .filter(key => key.startsWith('player-') && Boolean((data[key] as string).trim()))
        .map(key => data[key] as string);
    const invitations = {
        players: [...new Set(playerInvitations)],
        coach: formData.get('coach') as string || null,
        musician: formData.get('musician') as string || null
    }
    const teamId = await saveTeam(team, invitations);
    redirect(`/teams/${teamId}`);
}