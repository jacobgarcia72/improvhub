'use server';

import fs from 'node:fs';

import slugify from 'slugify';

import { Event } from "@/types";
import { dummyShows } from "./dummy-data";
import sql from 'better-sqlite3';
import { removeLeadingArticles } from './helper-functions';

const contentDB = sql('content.db');

function initDb() {
    contentDB.prepare(`
        CREATE TABLE IF NOT EXISTS shows (
            id STRING PRIMARY KEY,
            creatorId TEXT NOT NULL,
            title TEXT NOT NULL,
            dates TEXT,
            times TEXT,
            recurringDay TEXT,
            cadence TEXT,
            description TEXT,
            theatre TEXT,
            zipcode TEXT,
            price NUMERIC,
            doorPrice NUMERIC,
            webpage TEXT,
            image TEXT,
            teams TEXT,
            performers TEXT
        )
    `).run();
}
initDb();

export async function getShow(id: string) {
    return await contentDB.prepare('SELECT * FROM shows WHERE id = ?').get(id);
}

export async function getShows(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // throw new Error('Failed to fetch shows');

    return dummyShows;
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
    // show.description = xss(show.description);

    if (imageFile && imageFile.size) {
        const extension = imageFile.name.split('.').pop();
        const fileName = `${show.id}.${extension}`;

        const stream = fs.createWriteStream(`public/temp-images/${fileName}`);
        const bufferedImage = await imageFile.arrayBuffer();
        stream.write(Buffer.from(bufferedImage), (error) => {
            if (error) {
                throw new Error('Failed to save image');
            }
        });

        show.image = `/temp-images/${fileName}`;
    }

    contentDB.prepare(`
        INSERT INTO shows (
            id,
            creatorId,
            title,
            dates,
            times,
            recurringDay,
            cadence,
            description,
            theatre,
            zipcode,
            price,
            doorPrice,
            webpage,
            image
        )
        VALUES (
            $id,
            $creatorId,
            $title,
            $dates,
            $times,
            $recurringDay,
            $cadence,
            $description,
            $theatre,
            $zipcode,
            $price,
            $doorPrice,
            $webpage,
            $image
        )
    `).run(show);

    return show.id;
}