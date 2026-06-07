/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import slugify from 'slugify';

import { Candence, Event, Role, ShowCastMember, Showing } from "@/types";
import { prepDataForDb, removeLeadingArticles } from './helper-functions';
import { supabaseAdmin } from './supabase-server';
import { getCitiesWithinRange } from './location';

const convertDataToShow = (data: { [key: string]: any }): Event => {
    return {
        id: data.id as string,
        creatorId: data.creator_id as string,
        admins: typeof data.admins === 'string' ? data.admins.split(',') : data.admins || [],
        title: data.title as string,
        recurringDay: data.recurring_day === null ? null : Number(data.recurring_day),
        recurringTime: data.recurring_time || null,
        cadence: data.cadence as Candence || null,
        description: data.description || null,
        theatre: data.theatre || null,
        city: data.city || null,
        state: data.state || null,
        price: data.price === null ? null : Number(data.price),
        doorPrice: data.door_price === null ? null : Number(data.door_price),
        ticketsUrl: data.tickets_url || null,
        image: data.image || null,
        photoCredit: data.photo_credit || null,
        runtime: data.runtime || null,
        notes: data.notes || null,
    };
};

const convertDataToShowing = (data: { [key: string]: any }): Showing => ({
    eventId: data.event_id as string,
    dateTime: data.date_time as string,
    lookingForTeams: Boolean(data.looking_for_teams),
    lookingForPlayers: Boolean(data.looking_for_players),
    lookingForDirectors: Boolean(data.looking_for_directors),
    lookingForMusician: Boolean(data.looking_for_musician),
    lookingForTech: Boolean(data.looking_for_tech)
});

const convertDataToShowCastMember = (data: { [key: string]: any }): ShowCastMember => ({
    showId: data.show_id as string,
    dateTime: data.date_time as string,
    role: data.role as Role | 'team',
    name: data.name as string,
    id: data.id as string
});

export async function getShow(id: string) {
    const { data, error } = await supabaseAdmin
        .from('shows')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? convertDataToShow(data) : null;
}

export async function getShowings(eventId: string): Promise<Showing[]> {
    const { data, error } = await supabaseAdmin
        .from('showings')
        .select('*')
        .eq('event_id', eventId);
    if (error) throw error;
    return (data || []).map(convertDataToShowing);
}

export async function getShowing(eventId: string, dateTime: string): Promise<Showing | null> {
    const normalizedDateTime = dateTime.replace('%20', ' ').replace('%3A', ':');
    const { data, error } = await supabaseAdmin
        .from('showings')
        .select('*')
        .eq('event_id', eventId)
        .eq('date_time', normalizedDateTime)
        .maybeSingle();
    if (error) throw error;
    return data ? convertDataToShowing(data) : null;
}

export async function getShowingsForEvents(eventIds: string[]): Promise<Showing[]> {
    const { data, error } = await supabaseAdmin
        .from('showings')
        .select('*')
        .in('event_id', eventIds);
    if (error) throw error;
    return (data || []).map(convertDataToShowing);
}

export async function getShowCast(showId: string, dateTime: string): Promise<ShowCastMember[]> {
    const { data, error } = await supabaseAdmin
        .from('showing_cast')
        .select('*')
        .eq('show_id', showId)
        .eq('date_time', dateTime);
    if (error) throw error;
    return (data || []).map(convertDataToShowCastMember);
}

export async function getShowsByTheatre(theatre: string) {
    const { data, error } = await supabaseAdmin
        .from('shows')
        .select('*')
        .ilike('theatre', `%${removeLeadingArticles(theatre)}%`);
    if (error) throw error;
    return (data || []).map(convertDataToShow);
}

export async function getShowsInRange(cityOrZipcode: string, miles: number) {
    const citiesInRange = getCitiesWithinRange(cityOrZipcode, miles);
    if (!citiesInRange.length) return [];
    const { data, error } = await supabaseAdmin
        .from('shows')
        .select('*');
    if (error) throw error;
    return (data || [])
        .filter((show: any) => show.city && show.state && citiesInRange.includes(`${show.city} ${show.state}`))
        .map(convertDataToShow);
}

export async function saveShow(show: Event, showings: Showing[] | null): Promise<string> {
    const baseId = slugify(`${show.theatre ? removeLeadingArticles(show.theatre) + ' ' : ''}${removeLeadingArticles(show.title)}`, { lower: true, trim: true });
    let showId = baseId;
    let counter = 1;
    let existingShow = await getShow(showId);
    while (existingShow) {
        counter++;
        showId = `${baseId}-${counter}`;
        existingShow = await getShow(showId);
    }
    show.id = showId;

    const { error: showInsertError } = await supabaseAdmin
        .from('shows')
        .insert({
            id: show.id,
            creator_id: show.creatorId,
            admins: show.admins.join(','),
            title: show.title,
            recurring_day: show.recurringDay,
            recurring_time: show.recurringTime,
            cadence: show.cadence,
            description: show.description,
            theatre: show.theatre,
            city: show.city,
            state: show.state,
            price: show.price,
            door_price: show.doorPrice,
            tickets_url: show.ticketsUrl,
            image: show.image,
            photo_credit: show.photoCredit,
            runtime: show.runtime,
            notes: show.notes
        });
    if (showInsertError) throw showInsertError;

    if (showings?.length) {
        const showingsToInsert = showings.map((showing) => ({
            event_id: show.id,
            date_time: showing.dateTime
        }));
        const { error: showingInsertError } = await supabaseAdmin
            .from('showings')
            .insert(showingsToInsert);
        if (showingInsertError) throw showingInsertError;
    }

    return show.id;
}

export async function updateShowing(showId: string, dateTime: string, updates: Partial<Showing>, cast?: Partial<ShowCastMember>[]): Promise<boolean> {
    const data = prepDataForDb(updates);
    const { error: updateError } = await supabaseAdmin
        .from('showings')
        .update(data)
        .eq('event_id', showId)
        .eq('date_time', dateTime);
    if (updateError) throw updateError;

    if (cast?.length) {
        const castRows = cast.map((castMember) => ({
            name: castMember.name,
            id: castMember.id,
            role: castMember.role,
            show_id: showId,
            date_time: dateTime
        }));
        const { error: castInsertError } = await supabaseAdmin
            .from('showing_cast')
            .insert(castRows);
        if (castInsertError) throw castInsertError;
    }
    return true;
}
