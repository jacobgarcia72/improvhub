'use server';
import slugify from 'slugify';
import { redirect } from "next/navigation";
import { saveShow, updateShowing } from "@/lib/shows";
import { Candence, Event, Showing, Role, ShowCastMember } from "@/types";
import { sortDates } from "@/lib/dates";
import { theatres } from "@/lib/theatres";
import { capitalize, removeLeadingArticles } from "@/lib/helper-functions";
import { Team } from '@/types';
import { destroyImage, uploadImage } from '@/lib/cloudinary';
import { getTeam, getTeamMembers, leaveTeam as leaveTeamRecord, saveTeam, updateTeam as updateTeamRecord, updateTeamDetails as updateTeamDetailsRecord } from '@/lib/teams';
import { getCurrentUser, updateUser } from "@/lib/users";
import { revalidatePath } from 'next/cache';

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

    const imageFile = formData.get('image') as File || null;
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

    let dateTimes: string[] | null = null;
    let recurringDay: number | null = null;
    let recurringTime: string | null = null;
    let cadence: Candence | null = null;
    if (!formData.get('tbd')) {
        if (formData.get('recurring')) {
            recurringDay = Number(formData.get('weekday'));
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
        admins: [creatorId],
        title,
        image: imageUrl || null,
        photoCredit,
        theatre,
        city,
        state,
        description,
        recurringDay,
        recurringTime,
        cadence,
        runtime,
        price: price === '' ? null : Number(price),
        doorPrice: doorPrice === '' ? null : Number(doorPrice),
        ticketsUrl,
        notes
    };
    const showings: Showing[] | null = dateTimes?.map((dateTime => ({
        eventId: show.id,
        dateTime
    }))) || null;

    const showId = await saveShow(show, showings);
    redirect(`/shows/${showId}`);
}

export async function postShowCast(showId: string, showDateTime: string, prevState: void | { message?: string }, formData: FormData) {
    const creatorId = (await getCurrentUser())?.id;
    if (!creatorId) throw new Error('You must be logged in to continue');

    const data = Object.fromEntries(formData.entries());

    const getCastByRole = (role: (Role | 'team')): { name: string, id: string | null, role: (Role | 'team') }[] => {
        const members = Object.keys(data)
            .filter((key) => (
                (key.split('-')[0] === role) &&
                (key.split('-')[2] !== 'id') &&
                Boolean((data[key] as string).trim())
            ))
            .map((key) => {
                return {
                    name: (data[key] as string).trim(),
                    id: (data[`${key}-id`] as string)?.trim() || null,
                    role
                }
            });
        return [...new Set(members)];
    }
    const directors = getCastByRole('director');
    const teams = getCastByRole('team');
    const players = getCastByRole('player');
    const tech = getCastByRole('tech');
    const musicians = getCastByRole('musician');

    const updates: Partial<Showing> = {
        lookingForDirectors: Boolean(data.lookingForDirectors),
        lookingForTeams: Boolean(data.lookingForTeams),
        lookingForPlayers: Boolean(data.lookingForPlayers),
        lookingForTech: Boolean(data.lookingForTech),
        lookingForMusician: Boolean(data.lookingForMusician)
    }
    const cast: Partial<ShowCastMember>[] = [
        ...directors, ...teams, ...players, ...tech, ...musicians
    ]
    await updateShowing(showId, showDateTime, updates, cast);
    revalidatePath(`/shows/${showId}/${showDateTime}`);
    redirect(`/shows/${showId}/${showDateTime}`);
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

    let city = (data.city as string).trim() || null;
    if (city) city = capitalize(city);

    const team: Team = {
        id: slugify(removeLeadingArticles(name), { lower: true, trim: true }),
        name,
        image: imageUrl,
        photoCredit: data.photoCredit as string || null,
        city,
        state: data.state as string || null,
        theatres,
        lookingForPlayers: Boolean(data.lookingForPlayers),
        lookingForCoach: Boolean(data.lookingForCoach),
        lookingForMusician: Boolean(data.lookingForMusician),
        description,
    }

    const getTeamMembersByRole = (role: Role): { name: string, id: string | null, role: Role }[] => {
        const members = Object.keys(data)
            .filter((key) => (
                (key.split('-')[0] === role) &&
                (key.split('-')[2] !== 'id') &&
                Boolean((data[key] as string).trim())
            ))
            .map((key) => {
                return {
                    name: (data[key] as string).trim(),
                    id: (data[`${key}-id`] as string)?.trim() || null,
                    role
                }
            });
        return [...new Set(members)];
    }
    const players = getTeamMembersByRole('player');
    const coaches = getTeamMembersByRole('coach');
    const musicians = getTeamMembersByRole('musician');
    const teamMembers = [ ...players, ...coaches, ...musicians ];
    const teamId = await saveTeam(team, teamMembers);
    redirect(`/teams/${teamId}`);
}

export async function updateTeam(teamId: string, prevState: void | { message?: string }, formData: FormData) {
    const userId = (await getCurrentUser())?.id;
    if (!userId) throw new Error('You must be logged in to continue');

    const team = await getTeam(teamId);
    if (!team) throw new Error('Cannot find record of team');
    const members = await getTeamMembers(teamId);
    const isMember = members.some((member) => member.id === userId && member.confirmed);
    if (!isMember) throw new Error('You must be a member of this team to update it');

    const data = Object.fromEntries(formData.entries());
    const getTeamMembersByRole = (role: Role): { name: string, id: string | null, role: Role }[] => {
        const members = Object.keys(data)
            .filter((key) => (
                (key.split('-')[0] === role) &&
                (key.split('-')[2] !== 'id') &&
                Boolean((data[key] as string).trim())
            ))
            .map((key) => {
                return {
                    name: (data[key] as string).trim(),
                    id: (data[`${key}-id`] as string)?.trim() || null,
                    role
                }
            });
        return [...new Set(members)];
    }

    const players = getTeamMembersByRole('player');
    const coaches = getTeamMembersByRole('coach');
    const musicians = getTeamMembersByRole('musician');
    await updateTeamRecord(
        teamId,
        {
            lookingForPlayers: Boolean(data.lookingForPlayers),
            lookingForCoach: Boolean(data.lookingForCoach),
            lookingForMusician: Boolean(data.lookingForMusician)
        },
        [ ...players, ...coaches, ...musicians ],
        userId
    );
    revalidatePath(`/teams/${teamId}`);
    redirect(`/teams/${teamId}`);
}

export async function updateTeamDetails(teamId: string, prevState: void | { message?: string }, formData: FormData) {
    const userId = (await getCurrentUser())?.id;
    if (!userId) throw new Error('You must be logged in to continue');

    const team = await getTeam(teamId);
    if (!team) throw new Error('Cannot find record of team');

    const members = await getTeamMembers(teamId);
    const canManageTeam = members.some((member) => (
        member.id === userId &&
        member.confirmed &&
        member.role !== 'coach'
    ));
    if (!canManageTeam) throw new Error('You must be a member of this team to update it');

    const data = Object.fromEntries(formData.entries());
    const name = (data.name as string)?.trim();
    if (!name) return { message: 'Team name is required' };

    const imageFile = data.image as File;
    let imageUrl = team.image;
    if (imageFile && imageFile.size) {
        if (imageFile.size > 5 * 1024 * 1024) {
            return { message: 'Image file size exceeds 5MB limit' };
        }
        try {
            imageUrl = await uploadImage(imageFile, 'teams');
            if (team.image && team.image !== imageUrl) {
                await destroyImage(team.image);
            }
        } catch {
            throw new Error('Image upload failed');
        }
    }

    const checkedTheatres = Object.keys(data)
        .filter(key => key.startsWith('theatre-') && Boolean((data[key] as string).trim()))
        .map(key => data[key] as string);

    const addedTheatres = Object.keys(data)
        .filter(key => key.startsWith('added-theatre-') && Boolean((data[key] as string).trim()))
        .map(key => data[key] as string);

    const theatres = [...new Set(checkedTheatres.concat(addedTheatres))];

    let city = (data.city as string)?.trim() || null;
    if (city) city = capitalize(city);

    let description = data.description as string || null;
    if (description) description = description.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>').replace(/\r/g, '<br>');

    await updateTeamDetailsRecord(teamId, {
        name,
        image: imageUrl,
        photoCredit: data.photoCredit as string || null,
        city,
        state: data.state as string || null,
        theatres,
        description
    });
    revalidatePath(`/teams/${teamId}`, 'layout');
    redirect(`/teams/${teamId}`);
}

export async function leaveTeam(teamId: string): Promise<void> {
    const userId = (await getCurrentUser())?.id;
    if (!userId) throw new Error('You must be logged in to continue');

    const result = await leaveTeamRecord(teamId, userId);
    revalidatePath(`/teams/${teamId}`, 'layout');
    if (result.deletedTeam) {
        revalidatePath('/teams');
        redirect('/teams');
    }
    redirect(`/teams/${teamId}`);
}

export async function updateUserCommunityOptions(prevState: void | { message?: string }, formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const userId = (await getCurrentUser())?.id;
        if (!userId) throw new Error('You must be logged in to continue');
        const city = (data.city as string).trim() || null;
        const state = (data.state as string).trim() || null;
        const checkedTheatres = Object.keys(data)
            .filter(key => key.startsWith('theatre-') && Boolean((data[key] as string).trim()))
            .map(key => data[key] as string);

        const addedTheatres = Object.keys(data)
            .filter(key => key.startsWith('added-theatre-') && Boolean((data[key] as string).trim()))
            .map(key => data[key] as string);
        const theatres = [...new Set(checkedTheatres.concat(addedTheatres))].join(',');
        await updateUser({ city, state, theatres });
        revalidatePath(`/profile/${userId}`);
        return;
    } catch (error) {
        console.error('Error updating user community options:', error);
        return { message: 'Something went wrong. Please try again later.' };
    }
}
