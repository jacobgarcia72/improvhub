/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import slugify from 'slugify';

import { Event, NewsFeedItem, Role, ShowCastMember, Showing, Theatre, User } from "@/types";
import { camelCaseObject, removeLeadingArticles, snakeCaseObject } from './helper-functions';
import { supabaseAdmin } from './supabase-server';
import { getCitiesWithinRange } from './location';
import { revalidatePath } from 'next/cache';
import { dateMatchesRecurringSchedule, getStartOfToday, normalizeDateTime } from './dates';
import { getTeamsByUser } from './teams';
import { createNewsFeedItem } from './news';

export async function getShow(id: string): Promise<Event | null> {
    const { data, error } = await supabaseAdmin
        .from('shows')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as Event : null;
}

export async function getShowsByAdmin(userId: string): Promise<Event[]> {
    const { data } = await supabaseAdmin
        .from('shows')
        .select('*')
        .contains('admins', [userId]);
    return (data || []).map(camelCaseObject) as Event[];
}

export async function getShowsLookingForRole(role: Role | 'team', user: User): Promise<{ show: Event, dateTimes: string[] }[]> {
    const key = {
        team: 'looking_for_teams',
        player: 'looking_for_players',
        director: 'looking_for_directors',
        musician: 'looking_for_musician',
        tech: 'looking_for_tech',
        coach: null
    }[role];
    const { data } = await supabaseAdmin
        .from('showings')
        .select('*')
        .eq(key, true)
        .gte('date_time', getStartOfToday());

    const showDates: { [showId: string]: string[] } = { };
    const showIds: string[] = [];

    (data || []).forEach(({ event_id, date_time }: { event_id: string; date_time: string }) => {
        if (!showDates[event_id]) {
            showDates[event_id] = [];
            showIds.push(event_id);
        }
        const dateTime = normalizeDateTime(date_time);
        if (!showDates[event_id].includes(dateTime)) {
            showDates[event_id].push(dateTime);
        }
    });

    const res: { show: Event, dateTimes: string[] }[] = [];

    for (let i = 0; i < showIds.length; i++) {
        const showId = showIds[i];
        const show = await getShow(showId);
        const showIsLocal = show && (
            (
                show.city && show.state && show.city === user.city && show.state === user.state
            ) || (
                show.theatre && user.theatres?.includes(show.theatre)
            )
        )
        if (showIsLocal) {
            res.push({ show, dateTimes: showDates[showId] });
        }
    }
    return res;
}

export async function getUpcomingShowsByCastMember(userId: string, roles: (Role | 'team')[] = ['player', 'musician', 'tech', 'director'], includeUsersTeams = false): Promise<{ show: Event, dateTimes: string[] }[]> {
    let teams: string[] = [];
    if (includeUsersTeams) {
        teams = (await getTeamsByUser(userId)).map((team) => team.id);
    }
    const { data } = await supabaseAdmin
        .from('showing_cast')
        .select('show_id, date_time')
        .or(`and(id.eq.${userId},role.in.(${roles.join(',')})),and(id.in.(${teams.join(',')}),role.eq.team)`)
        .gte('date_time', getStartOfToday());

    const showDates: { [showId: string]: string[] } = { };
    const showIds: string[] = [];

    (data || []).forEach(({ show_id, date_time }: { show_id: string; date_time: string }) => {
        if (!showDates[show_id]) {
            showDates[show_id] = [];
            showIds.push(show_id);
        }
        const dateTime = normalizeDateTime(date_time);
        if (!showDates[show_id].includes(dateTime)) {
            showDates[show_id].push(dateTime);
        }
    });

    const res: { show: Event, dateTimes: string[] }[] = [];

    for (let i = 0; i < showIds.length; i++) {
        const showId = showIds[i];
        const show = await getShow(showId);
        if (show) {
            res.push({ show, dateTimes: showDates[showId] });
        }
    }
    return res;
}

export async function getUpcomingShowsByTheatre(theatre: Theatre): Promise<{ show: Event, dateTimes: string[] }[]> {
    const { data: showData } = await supabaseAdmin
        .from('shows')
        .select('id')
        .or(`theatre.eq.${theatre.id},theatre.ilike.${theatre.name},theatre.ilike.${removeLeadingArticles(theatre.name)}`);
    const showsAtTheatre = showData || [];
    const { data } = await supabaseAdmin
        .from('showings')
        .select('event_id, date_time')
        .in('event_id', showsAtTheatre.map(({ id }: { id: string }) => id))
        .gte('date_time', getStartOfToday());

    const showDates: { [showId: string]: string[] } = { };
    const showIds: string[] = [];

    (data || []).forEach(({ event_id, date_time }: { event_id: string; date_time: string }) => {
        if (!showDates[event_id]) {
            showDates[event_id] = [];
            showIds.push(event_id);
        }
        const dateTime = normalizeDateTime(date_time);
        if (!showDates[event_id].includes(dateTime)) {
            showDates[event_id].push(dateTime);
        }
    });

    const res: { show: Event, dateTimes: string[] }[] = [];

    for (let i = 0; i < showIds.length; i++) {
        const showId = showIds[i];
        const show = await getShow(showId);
        if (show) {
            res.push({ show, dateTimes: showDates[showId] });
        }
    }
    return res;
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
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
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
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const { data, error } = await supabaseAdmin
        .from('showing_cast')
        .select('*')
        .eq('show_id', showId)
        .eq('date_time', normalizedDateTime);
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

export async function getRsvpStatus(userId: string, showId: string, showDate: string): Promise<string | null> {
    const { data } = await supabaseAdmin
        .from('rsvps')
        .select('status')
        .eq('user_id', userId)
        .eq('show_id', showId)
        .eq('date_time', showDate)
        .maybeSingle();
    return data?.status || null;
}

export async function getRsvpCount(showId: string, showDate: string, status: string): Promise<number> {
    const { count } = await supabaseAdmin
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('show_id', showId)
        .eq('date_time', showDate)
        .eq('status', status)
        .maybeSingle();
    return count || 0;
}

export async function setRsvpStatus(userId: string, showId: string, showDate: string, value: string): Promise<void> {
    await supabaseAdmin
        .from('rsvps')
        .delete()
        .eq('user_id', userId)
        .eq('show_id', showId)
        .eq('date_time', showDate);
    await supabaseAdmin
        .from('rsvps')
        .insert({
            user_id: userId,
            show_id: showId,
            date_time: showDate,
            status: value
        });
    revalidatePath(`/shows/${showId}/${showDate}/`)
}


export async function saveShow(show: Event, showings: Showing[] | null): Promise<string> {
    const baseId = slugify(`${show.theatre ? show.theatre + ' ' : ''}${removeLeadingArticles(show.title)}`, { lower: true, trim: true });
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
    if (show.theatre) {
        createNewsFeedItem(new NewsFeedItem('theatre', show.theatre, 'new_show', show.id));
    }
    return show.id;
}

export async function updateShow(showId: string, show: Event, showings: Showing[] | null): Promise<void> {
    const { error: showInsertError } = await supabaseAdmin
        .from('shows')
        .update({
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
        })
        .eq('id', showId);
    if (showInsertError) throw showInsertError;

    const existingShowings = await getShowings(showId);
    if ((show.recurringDay || show.recurringDay === 0) && existingShowings.length) {
        const showingsToKeep = existingShowings.filter((existingShowing) => (
            dateMatchesRecurringSchedule(
                existingShowing.dateTime,
                show.recurringDay,
                show.cadence,
                show.recurringTime
            )
        ));
        const showingsToDelete = existingShowings.filter((existingShowing) => (
            !showingsToKeep.some((keeping) => keeping.dateTime === existingShowing.dateTime)
        ));

        if (showingsToDelete.length) {
            for (let i = 0; i < showingsToDelete.length; i++) {
                await supabaseAdmin
                    .from('showings')
                    .delete()
                    .eq('event_id', showId)
                    .eq('date_time', showingsToDelete[i].dateTime);
            }
        }
    } else if (showings?.length) {
        const newShowings = showings
            .filter((showing) => !existingShowings
                .find((existingShowing) => (
                    showing.dateTime === existingShowing.dateTime
                ))
            )
            .map((showing) => ({
                event_id: showId,
                date_time: showing.dateTime
            }));
        const showingsToDelete = existingShowings
            .filter((existingShowing) => !showings
                .find((showing) => (
                    showing.dateTime === existingShowing.dateTime
                ))
            );
        if (showingsToDelete.length) {
            for (let i = 0; i < showingsToDelete.length; i++) {
                await supabaseAdmin
                    .from('showings')
                    .delete()
                    .eq('event_id', showId)
                    .eq('date_time', showingsToDelete[i].dateTime);
            };
        }
        await supabaseAdmin
            .from('showings')
            .insert(newShowings);
    }
}

export async function updateShowAdmins(showId: string, admins: string[]) {
    await supabaseAdmin
        .from('shows')
        .update({ admins })
        .eq('id', showId);
}

export async function updateShowing(showId: string, dateTime: string, updates: Partial<Showing>, cast?: Partial<ShowCastMember>[]): Promise<boolean> {
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const { error: updateError } = await supabaseAdmin
        .from('showings')
        .update(snakeCaseObject(updates))
        .eq('event_id', showId)
        .eq('date_time', normalizedDateTime);
    if (updateError) throw updateError;

    if (cast) {
        const castRows = cast.map((castMember) => ({
            name: castMember.name,
            id: castMember.id,
            role: castMember.role,
            show_id: showId,
            date_time: normalizedDateTime
        }));
        await supabaseAdmin
            .from('showing_cast')
            .delete()
            .eq('show_id', showId)
            .eq('date_time', normalizedDateTime);
        await supabaseAdmin
            .from('showing_cast')
            .upsert(castRows);
    }
    return true;
}

export async function removeCastMember(showId: string, dateTime: string, userId: string, role: Role | 'team'): Promise<void> {
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    await supabaseAdmin
        .from('showing_cast')
        .delete()
        .eq('show_id', showId)
        .eq('date_time', normalizedDateTime)
        .eq('id', userId)
        .eq('role', role);
    revalidatePath(`/shows/${showId}/${dateTime}/`, 'layout');
}

export async function deleteShowing(eventId: string, dateTime: string): Promise<void> {
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    await supabaseAdmin
        .from('showings')
        .delete()
        .eq('event_id', eventId)
        .eq('date_time', normalizedDateTime);
    await supabaseAdmin
        .from('showing_cast')
        .delete()
        .eq('show_id', eventId)
        .eq('date_time', normalizedDateTime);
    revalidatePath(`/shows/${eventId}/`, 'layout');
}

export async function deleteShow(eventId: string): Promise<void> {
    await supabaseAdmin
        .from('shows')
        .delete()
        .eq('id', eventId)
    await supabaseAdmin
        .from('showings')
        .delete()
        .eq('event_id', eventId)
    await supabaseAdmin
        .from('showing_cast')
        .delete()
        .eq('show_id', eventId)
    revalidatePath(`/shows/${eventId}/`, 'layout');
}