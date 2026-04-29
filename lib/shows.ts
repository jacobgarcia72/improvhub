import { Event } from "@/types";
import { dummyShows } from "./dummy-data";

export function getShow(slug: string): Event | null {
    const show = dummyShows.find((s) => s.id === slug);
    return show || null;
}

export async function getShows(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // throw new Error('Failed to fetch shows');

    return dummyShows;
}
