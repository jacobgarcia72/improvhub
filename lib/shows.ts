'use server';

import slugify from 'slugify';

import { Candence, Event, WeekdayInitial } from "@/types";
import { removeLeadingArticles } from './helper-functions';
import { uploadImage } from './cloudinary';

import zipcodes from 'zipcodes';
import { contentDb } from './db';

const convertDataToShow = (data: {[key: string]: string | null}): Event => {
    return {
        id: data.id as string,
        creatorId: data.creatorId as string,
        title: data.title as string,
        dateTimes: data.dateTimes?.split(',') || null,
        recurringDay: data.recurringDay as WeekdayInitial || null,
        recurringTime: data.recurringTime || null,
        cadence: data.cadence as Candence || null,
        description: data.description || null,
        theatre: data.theatre || null,
        zipcode: data.zipcode || null,
        price: data.price === null ? null : Number(data.price),
        doorPrice: data.doorPrice === null ? null : Number(data.doorPrice),
        ticketsUrl: data.ticketsUrl || null,
        image: data.image || null,
        photoCredit: data.photoCredit || null,
        runtime: data.runtime || null,
        notes: data.notes || null,
    }
}

export async function getShow(id: string) {
    const data = await contentDb.prepare('SELECT * FROM shows WHERE id = ?').get(id) as {[key: string]: string | null};
    return data ? convertDataToShow(data) : null;
}

export async function getShowsByTheatre(theatre: string) {
    const data = contentDb.prepare('SELECT * FROM shows WHERE theatre LIKE ?').all(`%${theatre}%`) as {[key: string]: string | null}[];
    return data.map(convertDataToShow);
}

export async function getShowsByZipcode(zipcode: string, miles: number) {
    const zipcodesInRange = zipcodes.radius(zipcode, miles, false).map((z) => typeof z === 'string' ? z : z.zip);
    const data = contentDb.prepare(
        `SELECT * FROM shows WHERE zipcode IN (${zipcodesInRange.map(() => '?').join(', ')})`
    ).all(...zipcodesInRange) as {[key: string]: string | null}[];
    return data.map(convertDataToShow);

}

export async function saveShow(show: Event, imageFile: File | null): Promise<string> {
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

    if (imageFile && imageFile.size) {
        if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('Image file size exceeds 5MB limit');
        }
        let imageUrl = '';
        try {
            imageUrl = await uploadImage(imageFile, 'shows');
        } catch {
            throw new Error('Image upload failed');
        }
        show.image = imageUrl || null;
    }

    contentDb.prepare(`
        INSERT INTO shows (
            id,
            creatorId,
            title,
            dateTimes,
            recurringDay,
            recurringTime,
            cadence,
            description,
            theatre,
            zipcode,
            price,
            doorPrice,
            ticketsUrl,
            image,
            photoCredit,
            runtime,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
        show.id,
        show.creatorId,
        show.title,
        show.dateTimes?.join(',') || null,
        show.recurringDay,
        show.recurringTime,
        show.cadence,
        show.description,
        show.theatre,
        show.zipcode,
        show.price,
        show.doorPrice,
        show.ticketsUrl,
        show.image,
        show.photoCredit,
        show.runtime,
        show.notes
    );

    return show.id;
}