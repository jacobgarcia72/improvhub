/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import slugify from 'slugify';

import { AbbrevUser, Event, EventOccurrence, EventType, NewsType, Role, ShowCastMember, Showing, Theatre, User } from "@/types";
import { camelCaseObject, pluralize, removeLeadingArticles, snakeCaseObject } from './helper-functions';
import { supabaseAdmin } from './supabase-server';
import { getCitiesWithinRange } from './location';
import { revalidatePath } from 'next/cache';
import { dateMatchesRecurringSchedule, getStartOfToday, normalizeDateTime } from './dates';
import { getTeamMembers, getTeamsByUser } from './teams';
import { createNewsFeedItem, deleteNewsFeedItem } from './news';
import { getFriendIds, getFriends } from './users';
import { postNotification } from './notifications';

export async function getEvent(id: string, type: EventType): Promise<Event | null> {
    const { data, error } = await supabaseAdmin
        .from(`${pluralize(type)}`)
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as Event : null;
}

export async function getShow(id: string): Promise<Event | null> {
    return await getEvent(id, 'show');
}

export async function getEventsByAdmin(userId: string, type: EventType): Promise<Event[]> {
    if (['jam', 'class', 'workshop'].includes(type)) {
        const { data } = await supabaseAdmin
            .from(pluralize(type))
            .select('*')
            .or(`admins.cs.{"${userId}"},instructors.cs.{"${userId}"}`);
        return (data || []).map(camelCaseObject) as Event[];
    } else {
        const { data } = await supabaseAdmin
            .from(pluralize(type))
            .select('*')
            .contains('admins', [userId]);
        return (data || []).map(camelCaseObject) as Event[];
    }
}

export async function getUpcomingEventsByRSVP(userId: string, type: EventType, rsvp = 'g'): Promise<{ event: Event, dateTimes: string[] }[]> {
    const { data } = await supabaseAdmin
        .from('rsvps')
        .select('event_id, date_time')
        .eq('user_id', userId)
        .eq('status', rsvp)
        .eq('type', type)
        .gte('date_time', getStartOfToday());

    const eventDates: { [showId: string]: string[] } = { };
    const eventIds: string[] = [];

    (data || []).forEach(({ event_id, date_time }: { event_id: string; date_time: string }) => {
        if (!eventDates[event_id]) {
            eventDates[event_id] = [];
            eventIds.push(event_id);
        }
        const dateTime = normalizeDateTime(date_time);
        if (!eventDates[event_id].includes(dateTime)) {
            eventDates[event_id].push(dateTime);
        }
    });

    const res: { event: Event, dateTimes: string[] }[] = [];

    for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i];
        const event = await getEvent(eventId, type);
        if (event) {
            res.push({ event, dateTimes: eventDates[eventId] });
        }
    }
    return res;
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
        .from('show_occurrences')
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

export async function getUpcomingEventsByTheatre(theatre: Theatre, type: EventType = 'show'): Promise<{ event: Event, dateTimes: string[] }[]> {
    const { data: eventData } = await supabaseAdmin
        .from(pluralize(type))
        .select('id')
        .or(`theatre.eq.${theatre.id},theatre.ilike.${theatre.name},theatre.ilike.${removeLeadingArticles(theatre.name)}`);
    const eventsAtTheatre = eventData || [];
    const { data } = await supabaseAdmin
        .from(`${type}_occurrences`)
        .select('event_id, date_time')
        .in('event_id', eventsAtTheatre.map(({ id }: { id: string }) => id))
        .gte('date_time', getStartOfToday());

    const eventDates: { [eventId: string]: string[] } = { };
    const eventIds: string[] = [];

    (data || []).forEach(({ event_id, date_time }: { event_id: string; date_time: string }) => {
        if (!eventDates[event_id]) {
            eventDates[event_id] = [];
            eventIds.push(event_id);
        }
        const dateTime = normalizeDateTime(date_time);
        if (!eventDates[event_id].includes(dateTime)) {
            eventDates[event_id].push(dateTime);
        }
    });

    const res: { event: Event, dateTimes: string[] }[] = [];

    for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i];
        const event = await getEvent(eventId, type);
        if (event) {
            res.push({ event, dateTimes: eventDates[eventId] });
        }
    }
    return res;
}

export async function getEventOccurrences(eventId: string, type: EventType): Promise<EventOccurrence[]> {
    const { data, error } = await supabaseAdmin
        .from(`${type}_occurrences`)
        .select('*')
        .eq('event_id', eventId);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as EventOccurrence[];
}

export async function getShowings(eventId: string): Promise<Showing[]> {
    return await getEventOccurrences(eventId, 'show') as Showing[];
}

export async function getEventOccurrence(eventId: string, dateTime: string, type: EventType): Promise<Showing | null> {
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const { data, error } = await supabaseAdmin
        .from(`${type}_occurrences`)
        .select('*')
        .eq('event_id', eventId)
        .eq('date_time', normalizedDateTime)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as Showing : null;
}

export async function getIsASeries(eventId: string, type: EventType): Promise<boolean> {
    const { count, error } = await supabaseAdmin
        .from(`${type}_occurrences`)
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);
    if (error) throw error;
    return count > 1;
}

export async function getOccurrencesForEvents(eventIds: string[], type: EventType): Promise<EventOccurrence[]> {
    const { data, error } = await supabaseAdmin
        .from(`${type}_occurrences`)
        .select('*')
        .in('event_id', eventIds);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as EventOccurrence[];
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

export async function getEventsByTheatre(theatre: string, type: EventType): Promise<Event[]> {
    const { data } = await supabaseAdmin
        .from(pluralize(type))
        .select('*')
        .ilike('theatre', theatre);
    return (data || []).map(camelCaseObject) as Event[];
}

export async function getEventsInRange(cityOrZipcode: string, miles: number, type: EventType): Promise<Event[]> {
    const citiesInRange = getCitiesWithinRange(cityOrZipcode, miles);
    if (!citiesInRange.length) return [];
    const { data, error } = await supabaseAdmin
        .from(pluralize(type))
        .select('*');
    if (error) throw error;
    return (data || [])
        .filter((show: any) => show.city && show.state && citiesInRange.includes(`${show.city} ${show.state}`))
        .map(camelCaseObject) as Event[];
}

export async function getRsvpStatus(userId: string, eventId: string, eventDate: string, type: EventType): Promise<string | null> {
    const { data } = await supabaseAdmin
        .from('rsvps')
        .select('status')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .eq('date_time', eventDate)
        .eq('type', type)
        .maybeSingle();
    return data?.status || null;
}

export async function getRsvpCount(eventId: string, eventDate: string, status: string, type: EventType): Promise<number> {
    const { count } = await supabaseAdmin
        .from('rsvps')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('date_time', eventDate)
        .eq('type', type)
        .eq('status', status)
        .maybeSingle();
    return count || 0;
}

export async function getFriendsRsvpCount(eventId: string, eventDate: string, status: string, type: EventType, userId: string): Promise<number> {
    const friends = await getFriendIds(userId);
    if (friends.length) {
        const { count } = await supabaseAdmin
            .from('rsvps')
            .select('*', { count: 'exact', head: true })
            .eq('event_id', eventId)
            .eq('date_time', eventDate)
            .eq('type', type)
            .eq('status', status)
            .in('user_id', friends)
            .maybeSingle();
        return count || 0;
    } else {
        return 0;
    }
}

export async function getFriendsRsvp(eventId: string, eventDate: string, status: string, type: EventType, userId: string): Promise<AbbrevUser[]> {
    const normalizedDateTime = eventDate.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const friends = await getFriends(userId);
    if (friends.length) {
        const { data } = await supabaseAdmin
            .from('rsvps')
            .select('user_id')
            .eq('event_id', eventId)
            .eq('date_time', normalizedDateTime)
            .eq('type', type)
            .eq('status', status)
            .in('user_id', friends.map((f) => f.id));
        const friendsRsvped: string[] = (data || []).map((row: { user_id: string }) => row.user_id);
        return friends.filter((friend) => friendsRsvped.includes(friend.id));
    } else {
        return [];
    }
}

export async function setRsvpStatus(userId: string, eventId: string, eventDate: string, value: string, type: EventType): Promise<void> {
    await supabaseAdmin
        .from('rsvps')
        .delete()
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .eq('date_time', eventDate)
        .eq('type', type);
    await supabaseAdmin
        .from('rsvps')
        .insert({
            user_id: userId,
            event_id: eventId,
            date_time: eventDate,
            type: type,
            status: value
        });
    revalidatePath(`/${pluralize(type)}/${eventId}/${eventDate}/`);
    if (value === 'g') {
        await createNewsFeedItem('friend', userId, `going_to_${type}`, eventId, eventDate);
    } else {
        await deleteNewsFeedItem('friend', userId, `going_to_${type}`, eventId, eventDate);
    }
}


export async function saveEvent(type: EventType, event: Event, occurrences: EventOccurrence[] | null): Promise<string> {
    const isNewEvent = !event.id;
    if (isNewEvent) {
        const baseId = slugify(`${event.theatre ? event.theatre + ' ' : ''}${removeLeadingArticles(event.title)}`, { lower: true, trim: true, strict: true });
        let eventId = baseId;
        let counter = 1;
        let existingEvent = await getEvent(eventId, type);
        while (existingEvent) {
            counter++;
            eventId = `${baseId}-${counter}`;
            existingEvent = await getEvent(eventId, type);
        }
        event.id = eventId;
    }

    const { error: insertError } = await supabaseAdmin
        .from(`${pluralize(type)}`)
        .upsert(snakeCaseObject(event));

    if (insertError) throw insertError;

    if (event.instructors) {
        const { instructors } = event;
        const previousInstructors = isNewEvent ? [] : (await getEvent(event.id, type))?.instructors || [];
        for (let i = 0; i < instructors.length; i++) {
            const instructorId = instructors[i];
            if (isNewEvent || !previousInstructors.includes(instructorId)) {
                await createNewsFeedItem('friend', instructorId, `instructor_for_${type}` as NewsType, event.id);
            }
        }
        for (let i = 0; i < previousInstructors.length; i++) {
            const previousInstructorId = previousInstructors[i];
            if (!instructors.includes(previousInstructorId)) {
                await deleteNewsFeedItem('friend', previousInstructorId, `instructor_for_${type}` as NewsType, event.id);
            }
        }
    }

    if (isNewEvent) {
        if (occurrences?.length) {
            const occurrencesToInsert = occurrences.map((occurrence) => ({
                event_id: event.id,
                date_time: occurrence.dateTime
            }));
            const { error: occurrenceInsertError } = await supabaseAdmin
                .from(`${type}_occurrences`)
                .insert(occurrencesToInsert);
            if (occurrenceInsertError) throw occurrenceInsertError;
        }
        if (event.theatre) {
            await createNewsFeedItem('theatre', event.theatre, `new_${type}`, event.id, null, event.admins[0]);
        }
        return event.id;
    } else {
        const existingOccurrences = await getEventOccurrences(event.id, type);
        if ((event.recurringDay || event.recurringDay === 0) && existingOccurrences.length) {
            const occurrencesToKeep = existingOccurrences.filter((existingOccurrence) => (
                dateMatchesRecurringSchedule(
                    existingOccurrence.dateTime,
                    event.recurringDay as number | null,
                    event.cadence as string | null,
                    event.recurringTime as string | null
                )
            ));
            const occurrencesToDelete = existingOccurrences.filter((existingOccurrence) => (
                !occurrencesToKeep.some((keeping) => keeping.dateTime === existingOccurrence.dateTime)
            ));

            if (occurrencesToDelete.length) {
                for (let i = 0; i < occurrencesToDelete.length; i++) {
                    await supabaseAdmin
                        .from(`${type}_occurrences`)
                        .delete()
                        .eq('event_id', event.id)
                        .eq('date_time', occurrencesToDelete[i].dateTime);
                }
            }
        } else if (occurrences?.length) {
            const newOccurrences = occurrences
                .filter((occurrence) => !existingOccurrences
                    .find((existingOccurrence) => (
                        occurrence.dateTime === existingOccurrence.dateTime
                    ))
                )
                .map((occurrence) => ({
                    event_id: event.id,
                    date_time: occurrence.dateTime
                }));
            const occurrencesToDelete = existingOccurrences
                .filter((existingOccurrence) => !occurrences
                    .find((occurrence) => (
                        occurrence.dateTime === existingOccurrence.dateTime
                    ))
                );
            if (occurrencesToDelete.length) {
                for (let i = 0; i < occurrencesToDelete.length; i++) {
                    await deleteOccurrence(event.id, occurrencesToDelete[i].dateTime, type);
                };
            }
            await supabaseAdmin
                .from(`${type}_occurrences`)
                .insert(newOccurrences);
        }
    return event.id;
    }
}

export async function updateEventAdmins(type: EventType, eventId: string, admins: string[]) {
    await supabaseAdmin
        .from(pluralize(type))
        .update({ admins })
        .eq('id', eventId);
}

export async function updateEventInstructors(type: EventType, eventId: string, instructors: string[]) {
    await supabaseAdmin
        .from(pluralize(type))
        .update({ instructors })
        .eq('id', eventId);
}

export async function updateShowing(showId: string, dateTime: string, updates: Partial<Showing>, cast?: Partial<ShowCastMember>[]): Promise<boolean> {
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const { error: updateError } = await supabaseAdmin
        .from('show_occurrences')
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
        const currentCast = await getShowCast(showId, normalizedDateTime);
        const newCastMembers = cast.filter((member) => !currentCast.find(({ id, role}) => id === member.id && role === member.role));
        const removedCastMembers = currentCast.filter((member) => !cast.find(({ id, role}) => id === member.id && role === member.role));
        await supabaseAdmin
            .from('showing_cast')
            .delete()
            .eq('show_id', showId)
            .eq('date_time', normalizedDateTime);
        await supabaseAdmin
            .from('showing_cast')
            .upsert(castRows);
        ['team', 'player', 'musician', 'director', 'tech'].forEach(async role => {
            const usersToNotify = newCastMembers.filter((m) => m.id && m.role === role).map((m) => m.id).filter(m => m !== null && m !== undefined);
            if (role === 'team') {
                usersToNotify.map(async (teamId) => {
                    const teamMembersToNotify = (await getTeamMembers(teamId, true)).map(m => m.id).filter(m => m !== null);
                    postNotification(showId, teamMembersToNotify, 'cast_in_show', `${normalizedDateTime},${role},${teamId}`);
                });
            } else {
                postNotification(showId, usersToNotify, 'cast_in_show', `${normalizedDateTime},${role}`);
            }
        })
        for (let i = 0; i < newCastMembers.length; i++) {
            const { id, role } = newCastMembers[i];
            if (id) await createNewsFeedItem(role === 'team' ? 'team' : 'friend', id, 'cast_in_show', showId, normalizedDateTime, role);
        }
        for (let i = 0; i < removedCastMembers.length; i++) {
            const { id, role } = removedCastMembers[i];
            if (id) await deleteNewsFeedItem(role === 'team' ? 'team' : 'friend', id, 'cast_in_show', showId, normalizedDateTime, role);
        }
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
    const cast = await getShowCast(showId, dateTime);
    const directors = cast.filter((c) => c.role === 'director').map((c) => c.id).filter((d) => d !== null);
    const show = await getShow(showId);
    const admins = show?.admins || [];
    const adminsAndDirectors = [...new Set(admins.concat(directors))]
        .filter((a) =>  a !== userId || role === 'team'); // no need to notify yourself
    if (adminsAndDirectors.length) {
        postNotification(userId, adminsAndDirectors, 'show_drop_out', `${showId},${dateTime},${role}`);
    }
    revalidatePath(`/shows/${showId}/${dateTime}/`, 'layout');
    await deleteNewsFeedItem(role === 'team' ? 'team' : 'friend', userId, 'cast_in_show', showId, normalizedDateTime, role);
}

export async function deleteOccurrence(eventId: string, dateTime: string, type: EventType): Promise<void> {
    const normalizedDateTime = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    let showTitle = '';
    if (type === 'show') {
        const { data: showData } = await supabaseAdmin
            .from('shows')
            .select('title')
            .eq('id', eventId)
            .single();
        showTitle = showData.title;
    }
    await supabaseAdmin
        .from(`${type}_occurrences`)
        .delete()
        .eq('event_id', eventId)
        .eq('date_time', normalizedDateTime);
    if (type === 'show') {
        const { data } = await supabaseAdmin
            .from('showing_cast')
            .delete()
            .eq('show_id', eventId)
            .eq('date_time', normalizedDateTime)
            .select('id, role');
        const usersToNotify: string[] = [];
        for (let i = 0; i < data.length; i++) {
            const { id, role } = data[i];
            if (!id) return;
            if (role === 'team') {
                const teamMembers = (await getTeamMembers(id)).map((m) => m.id).filter(m => m !== null);
                usersToNotify.push(...teamMembers);
            } else {
                usersToNotify.push(id);
            }
        };
        if (usersToNotify.length) postNotification(eventId, usersToNotify, 'showing_cancelled', `${showTitle},${dateTime}`);
    }
    revalidatePath(`/${pluralize(type)}/${eventId}/`, 'layout');
}

export async function deleteEvent(eventId: string, type: EventType): Promise<void> {
    const { data: showData } = await supabaseAdmin
        .from(`${pluralize(type)}`)
        .delete()
        .eq('id', eventId)
        .select('title')
        .single();
    await supabaseAdmin
        .from(`${type}_occurrences`)
        .delete()
        .eq('event_id', eventId)
    if (type === 'show') {
        const { data } = await supabaseAdmin
            .from('showing_cast')
            .delete()
            .eq('show_id', eventId)
            .select('id, role');
        const usersToNotify: string[] = [];
        for (let i = 0; i < data.length; i++) {
            const { id, role } = data[i];
            if (!id) return;
            if (role === 'team') {
                const teamMembers = (await getTeamMembers(id)).map((m) => m.id).filter(m => m !== null);
                usersToNotify.push(...teamMembers);
            } else {
                usersToNotify.push(id);
            }
        };
        if (usersToNotify.length) postNotification(eventId, usersToNotify, 'show_cancelled', showData.title);
    }
    revalidatePath(`/${pluralize(type)}/${eventId}/`, 'layout');
}