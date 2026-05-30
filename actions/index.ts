'use server';
import slugify from 'slugify';
import { redirect } from "next/navigation";
import { saveShow } from "@/lib/shows";
import { Candence, Event, WeekdayInitial } from "@/types";
import { sortDates, weekdayInitials } from "@/lib/dates";
import { theatres } from "@/lib/theatres";
import { capitalize, removeLeadingArticles } from "@/lib/helper-functions";
import { Team } from '@/types';
import { uploadImage } from '@/lib/cloudinary';
import { saveTeam } from '@/lib/teams';
import { getCurrentUser } from '@/lib/users';

export async function postShow(prevState: void | { message?: string }, formData: FormData) {
    const creatorId = (await getCurrentUser())?.id;
    if (!creatorId) throw new Error('You must be logged in to continue');

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
        creatorId,
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
    const creatorId = (await getCurrentUser())?.id;
    if (!creatorId) throw new Error('You must be logged in to continue');

    const data = Object.fromEntries(formData.entries());

    const name = (data.name as string)?.trim() || null;
    if (!name) return { message: 'Team name is required' };
    
    const imageFile = data.image as File;
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

    let description = data.description as string || null;
    if (description) description = description.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\r/g, '<br>');

    const checkedTheatres = Object.keys(data)
        .filter(key => key.startsWith('theatre-') && Boolean((data[key] as string).trim()))
        .map(key => data[key] as string);

    const addedTheatres = Object.keys(data)
        .filter(key => key.startsWith('added-theatre-') && Boolean((data[key] as string).trim()))
        .map(key => data[key] as string);

    const theatres = [...new Set(checkedTheatres.concat(addedTheatres))];

    const getAddedTeamMembersByRole = (role: string): string[] => {
        const invitations = Object.keys(data)
            .filter(key => key.startsWith(`${role}-`) && Boolean((data[key] as string).trim()))
            .map(key => (data[key] as string).trim());
        return [...new Set(invitations)];
    }
    const getConfirmedMembers = (members: string[]) => members.includes(creatorId) ? [creatorId] : []; // Only the creator is confirmed. All else must be invited.
    const players = getAddedTeamMembersByRole('player');
    const coaches = getAddedTeamMembersByRole('coach');
    const musicians = getAddedTeamMembersByRole('musician');

    let city = (data.city as string).trim() || null;
    if (city) city = capitalize(city);

    const team: Team = {
        id: slugify(name, { lower: true, trim: true }),
        admins: [creatorId],
        name,
        image: imageUrl,
        photoCredit: data.photoCredit as string || null,
        city,
        state: data.state as string || null,
        theatres,
        players: getConfirmedMembers(players),
        lookingForPlayers: Boolean(data.lookingForPlayers),
        coaches: getConfirmedMembers(coaches),
        lookingForCoach: Boolean(data.lookingForCoach),
        musicians: getConfirmedMembers(musicians),
        lookingForMusician: Boolean(data.lookingForMusician),
        description,
    }

    const invitations = {
        players: players.filter((id) => id !== creatorId),
        coaches: coaches.filter((id) => id !== creatorId),
        musicians: musicians.filter((id) => id !== creatorId)
    }

    const teamId = await saveTeam(team, invitations);
    redirect(`/teams/${teamId}`);
}