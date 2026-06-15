/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import slugify from 'slugify';

import { Event, ShowCastMember, Showing } from "@/types";
import { camelCaseObject, removeLeadingArticles, snakeCaseObject } from './helper-functions';
import { supabaseAdmin } from './supabase-server';
import { getCitiesWithinRange } from './location';

export async function getShow(id: string): Promise<Event | null> {
    const { data, error } = await supabaseAdmin
        .from('shows')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as Event : null;
}

export async function getShowings(eventId: string): Promise<Showing[]> {
    const { data, error } = await supabaseAdmin
        .from('showings')
        .select('*')
        .eq('event_id', eventId);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as Showing[];
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
    return data ? camelCaseObject(data) as Showing : null;
}

export async function getShowingsForEvents(eventIds: string[]): Promise<Showing[]> {
    const { data, error } = await supabaseAdmin
        .from('showings')
        .select('*')
        .in('event_id', eventIds);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as Showing[];
}

export async function getShowCast(showId: string, dateTime: string): Promise<ShowCastMember[]> {
    const { data, error } = await supabaseAdmin
        .from('showing_cast')
        .select('*')
        .eq('show_id', showId)
        .eq('date_time', dateTime);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as ShowCastMember[];
}

export async function getShowsByTheatre(theatre: string) {
    const { data } = await supabaseAdmin
        .from('shows')
        .select('*')
        .ilike('theatre', theatre);
    return (data || []).map(camelCaseObject) as Event[];
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
        .map(camelCaseObject) as Event[];
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
            admins: show.admins,
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
    const { error: updateError } = await supabaseAdmin
        .from('showings')
        .update(snakeCaseObject(updates))
        .eq('event_id', showId)
        .eq('date_time', dateTime);
    if (updateError) throw updateError;

    if (cast) {
        const castRows = cast.map((castMember) => ({
            name: castMember.name,
            id: castMember.id,
            role: castMember.role,
            show_id: showId,
            date_time: dateTime
        }));
        await supabaseAdmin
            .from('showing_cast')
            .delete()
            .eq('show_id', showId)
            .eq('date_time', dateTime);
        await supabaseAdmin
            .from('showing_cast')
            .upsert(castRows);
    }
    return true;
}
