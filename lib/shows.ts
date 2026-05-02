import slugify from 'slugify';

import { Event } from "@/types";
import { dummyShows } from "./dummy-data";

export function getShow(id: string): Event | null {
    const show = dummyShows.find((s) => s.id === id);
    return show || null;
}

export async function getShows(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // throw new Error('Failed to fetch shows');

    return dummyShows;
}

export async function saveShow(show: Event) {
    show.id = slugify(`${show.theatre} ${show.title}`, { lower: true });
    // show.description = xss(meal.description);

    // const extension = show.image.name.split('.').pop();
    // const fileName = `${show.slug}.${extension}`;

    // const stream = fs.createWriteStream(`public/images/${fileName}`);
    // const bufferedImage = await show.image.arrayBuffer();

    // stream.write(Buffer.from(bufferedImage), (error) => {
    //     if (error) {
    //         throw new Error('Failed to save image');
    //     }
    // });

    // show.image = `/images/${fileName}`;

    // db.prepare(`
    //     INSERT INTO shows
    //         (title, summary, instructions, creator, creator_email, image, slug)
    //     VALUES
    //         (@title, @summary, @instructions, @creator, @creator_email, @image, @slug)
    // `).run(show);
    return show.id;
}