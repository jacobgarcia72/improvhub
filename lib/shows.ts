'use server';

import fs from 'node:fs';

import slugify from 'slugify';

import { Event, EventFormData } from "@/types";
import { dummyShows } from "./dummy-data";

export async function getShow(id: string): Promise<Event | null> {
    const show = dummyShows.find((s) => s.id === id);
    return show || null;
}

export async function getShows(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // throw new Error('Failed to fetch shows');

    return dummyShows;
}

export async function saveShow(show: EventFormData): Promise<string> {
    const showId = slugify(`${show.theatre} ${show.title}`, { lower: true });
    // show.description = xss(meal.description);

    if (show.image) {
        const extension = show.image.name.split('.').pop();
        const fileName = `${showId}.${extension}`;

        const stream = fs.createWriteStream(`public/temp-images/${fileName}`);
        const bufferedImage = await show.image.arrayBuffer();
        console.log(fileName)
        stream.write(Buffer.from(bufferedImage), (error) => {
            console.log('Finished writing image');
            if (error) {
                throw new Error('Failed to save image');
            }
        });

        show.imageUrl = `/temp-images/${fileName}`;
    }

    // db.prepare(`
    //     INSERT INTO shows
    //         (title, summary, instructions, creator, creator_email, image, slug)
    //     VALUES
    //         (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)
    // `).run(show);
    return showId;
}