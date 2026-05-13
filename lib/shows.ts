'use server';

import fs from 'node:fs';

import slugify from 'slugify';

import { Event } from "@/types";
import { dummyShows } from "./dummy-data";
import sql from 'better-sqlite3';

const contentDB = sql('content.db');

function initDb() {
    contentDB.prepare(`
        CREATE TABLE IF NOT EXISTS shows (
            id STRING PRIMARY KEY,
            creatorId TEXT NOT NULL,
            title TEXT NOT NULL,
            dates TEXT,
            times TEXT,
            description TEXT,
            theatre TEXT,
            zipcode TEXT,
            price NUMERIC,
            doorPrice NUMERIC,
            webpage TEXT,
            image TEXT,
            teams TEXT,
            performers TEXT,
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

export async function saveShow(show: Event, imageFile?: File): Promise<string> {
    show.id = slugify(`${show.theatre} ${show.title}`, { lower: true });
    // show.description = xss(show.description);

    if (imageFile) {
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
            description,
            theatre,
            zipcode,
            price,
            doorPrice,
            webpage,
            image,
        )
        VALUES (
            $id,
            $creatorId,
            $title,
            $dates,
            $times,
            $description,
            $theatre,
            $zipcode,
            $price,
            $doorPrice,
            $webpage,
            $image,
        )
    `).run(show);
    return show.id;
}