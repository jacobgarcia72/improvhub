import { Event } from "@/types";
import { dummyShows } from "./dummy-data";

export async function getShows(): Promise<Event[]> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // throw new Error('Failed to fetch shows');

    return dummyShows;
}
