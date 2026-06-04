'use server';

import slugify from 'slugify';

import { Candence, Event, Role, ShowCastMember, Showing } from "@/types";
import { prepDataForDb, removeLeadingArticles } from './helper-functions';
import { contentDb } from './db';
import { getCitiesWithinRange } from './location';

const convertDataToShow = (data: {[key: string]: string | null}): Event => {
    return {
        id: data.id as string,
        creatorId: data.creatorId as string,
        admins: data.admins?.split(',') || [],
        title: data.title as string,
        recurringDay: data.recurringDay === null ? null : Number(data.recurringDay),
        recurringTime: data.recurringTime || null,
        cadence: data.cadence as Candence || null,
        description: data.description || null,
        theatre: data.theatre || null,
        city: data.city || null,
        state: data.state || null,
        price: data.price === null ? null : Number(data.price),
        doorPrice: data.doorPrice === null ? null : Number(data.doorPrice),
        ticketsUrl: data.ticketsUrl || null,
        image: data.image || null,
        photoCredit: data.photoCredit || null,
        runtime: data.runtime || null,
        notes: data.notes || null,
    }
}

const convertDataToShowing = (data: {[key: string]: string | null}): Showing => ({
    eventId: data.eventId as string,
    dateTime: data.dateTime as string,
    lookingForTeams: Boolean(data.lookingForTeams),
    lookingForPlayers: Boolean(data.lookingForPlayers),
    lookingForDirectors: Boolean(data.lookingForDirectors),
    lookingForMusician: Boolean(data.lookingForMusician),
    lookingForTech: Boolean(data.lookingForTech)
});

const convertDataToShowCastMember = (data: {[key: string]: string | null}): ShowCastMember => ({
    showId: data.showId as string,
    dateTime: data.dateTime as string,
    role: data.role as Role | 'team',
    name: data.name as string,
    id: data.id as string
});

export async function getShow(id: string) {
    const data = await contentDb.prepare('SELECT * FROM shows WHERE id = ?').get(id) as {[key: string]: string | null};
    return data ? convertDataToShow(data) : null;
}

export async function getShowingsForEvent(eventId: string): Promise<Showing[]> {
    const data = contentDb.prepare('SELECT * FROM showings WHERE eventId = ?').all(eventId) as {[key: string]: string | null}[];
    return data.map(convertDataToShowing);
}

export async function getShowing(eventId: string, dateTime: string): Promise<Showing | null> {
    const data = contentDb.prepare('SELECT * FROM showings WHERE eventId = ? AND dateTime = ?')
        .get(eventId, dateTime.replace('%20', ' ').replace('%3A', ':')) as {[key: string]: string | null};
    return data ? convertDataToShowing(data) : null;
}

export async function getShowingsForEvents(eventIds: string[]): Promise<Showing[]> {
    const data = contentDb.prepare(`SELECT * FROM showings WHERE eventId IN (${eventIds.map(() => '?').join(', ')})`).all(eventIds) as {[key: string]: string | null}[];
    return data.map(convertDataToShowing);
}

export async function getShowsByTheatre(theatre: string) {
    const data = contentDb.prepare('SELECT * FROM shows WHERE theatre LIKE ?').all(`%${removeLeadingArticles(theatre)}%`) as {[key: string]: string | null}[];
    return data.map(convertDataToShow);
}

export async function getShowsInRange(cityOrZipcode: string, miles: number) {
    const citiesInRange = getCitiesWithinRange(cityOrZipcode, miles);
    const data = contentDb.prepare(
        `SELECT * FROM shows WHERE (city || ' ' || state) IN (${citiesInRange.map(() => '?').join(', ')}) COLLATE NOCASE`
    ).all(...citiesInRange) as {[key: string]: string | null}[];
    return data.map(convertDataToShow);
}

export async function saveShow(show: Event, showings: Showing[] | null): Promise<string> {
    const id = slugify(`${show.theatre ? removeLeadingArticles(show.theatre) + ' ' : ''}${removeLeadingArticles(show.title)}`, { lower: true, trim: true });
    show.id = id;
    let isUnique = false;
    let counter = 1;

    while (!isUnique) {
        isUnique = !Boolean(await getShow(show.id));
        if (!isUnique) {
            counter++;
            show.id = `${id}-${counter}`;
        }
    }

    contentDb.prepare(`
        INSERT INTO shows (
            id,
            creatorId,
            admins,
            title,
            recurringDay,
            recurringTime,
            cadence,
            description,
            theatre,
            city,
            state,
            price,
            doorPrice,
            ticketsUrl,
            image,
            photoCredit,
            runtime,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        show.id,
        show.creatorId,
        show.admins.join(','),
        show.title,
        show.recurringDay,
        show.recurringTime,
        show.cadence,
        show.description,
        show.theatre,
        show.city,
        show.state,
        show.price,
        show.doorPrice,
        show.ticketsUrl,
        show.image,
        show.photoCredit,
        show.runtime,
        show.notes
    );

    showings?.forEach((showing) => {
        contentDb.prepare(`
            INSERT INTO showings (
                eventId,
                dateTime
            )
            VALUES (?, ?)
        `).run(
            show.id,
            showing.dateTime
        );
    });

    return show.id;
}

export async function updateShowing(showId: string, dateTime: string, updates: Partial<Showing>, cast?: Partial<ShowCastMember>[]): Promise<boolean> {
    const data = prepDataForDb(updates);
    const updateFields = Object.keys(data).map(key => `${key} = $${key}`).join(', ');
    contentDb.prepare(`
        UPDATE showings SET ${updateFields} WHERE eventId = ? AND dateTime = ?
    `).run({ ...data, showId, dateTime });

    cast?.forEach((castMember) => {
        contentDb.prepare(`
            INSERT INTO showing_cast (
                name,
                id,
                role,
                showId,
                dateTime
            )
            VALUES (?, ?, ?, ?, ?)
        `).run(
            castMember.name,
            castMember.id,
            castMember.role,
            showId,
            dateTime
        );
    });
    return true;
}
