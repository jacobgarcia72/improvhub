'use server';

import fs from 'node:fs';

import slugify from 'slugify';

import { Event } from "@/types";
import sql from 'better-sqlite3';
import { removeLeadingArticles } from './helper-functions';

const contentDB = sql('content.db');

function initDb() {
    contentDB.prepare(`
        CREATE TABLE IF NOT EXISTS shows (
            id STRING PRIMARY KEY,
            creatorId TEXT NOT NULL,
            title TEXT NOT NULL,
            dateTimes TEXT,
            recurringDay TEXT,
            recurringTime TEXT,
            cadence TEXT,
            description TEXT,
            theatre TEXT,
            zipcode TEXT,
            price NUMERIC,
            doorPrice NUMERIC,
            ticketsUrl TEXT,
            image TEXT,
            photoCredit TEXT,
            runtime TEXT,
            notes TEXT,
            teams TEXT,
            performers TEXT
        )
    `).run();
}
initDb();

export async function getShow(id: string) {
    return await contentDB.prepare('SELECT * FROM shows WHERE id = ?').get(id);
}

export async function getShowsByTheatre(theatre: string) {
    const query = 'SELECT * FROM shows WHERE theatre LIKE ?';
    const params = [`%${theatre}%`];
    // if (startDate) {
    //     query += ' AND (recurringDay IS NOT NULL OR (dateTimes IS NOT NULL AND dateTimes > ?))';
    //     params.push(startDate);
    // }
    return contentDB.prepare(query).all(...params);
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
        VALUES (
            $id,
            $creatorId,
            $title,
            $dateTimes,
            $recurringDay,
            $recurringTime,
            $cadence,
            $description,
            $theatre,
            $zipcode,
            $price,
            $doorPrice,
            $ticketsUrl,
            $image,
            $photoCredit,
            $runtime,
            $notes
        )
    `).run(show);

    return show.id;
}