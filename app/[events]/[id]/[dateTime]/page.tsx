import EventDatePage from "@/components/event-page-layout/[dateTime]/event-date-page";
import { singularize } from "@/lib/helper-functions";
import { EventType } from "@/types";
import { notFound } from "next/navigation";

export default async function JamDatePage(
    { params } : { params: Promise<{id: string, events: string, dateTime: string}> }
){
    const { id, events, dateTime } = await params;
    const type = singularize(events);
    console.log({id, events, dateTime, type})
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    return <EventDatePage id={id} dateTime={dateTime} type={type as EventType} />
}