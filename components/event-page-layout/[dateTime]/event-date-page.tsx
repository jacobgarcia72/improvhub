import { getIsASeries, getEvent, getEventOccurrence } from "@/lib/shows";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import EventDetails from "../event-details";
import EventHeader from "../event-header";
import EventDate from "./event-date";
import { dateMatchesRecurringSchedule } from "@/lib/dates";
import Occurrence from "./occurrence";
import { EventType } from "@/types";
import { pluralize } from "@/lib/helper-functions";

export default async function EventDatePage(
    { id, dateTime, type } : { id: string, dateTime: string, type: EventType }
){
    const parentEvent = id ? await getEvent(id, type) : null;
    if (!parentEvent) notFound();

    const eventDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const occurrence = id ? await getEventOccurrence(id, eventDate, type, true) : null;
    const { recurringDay, recurringTime, cadence } = parentEvent;
    const occurrenceExists = Boolean(occurrence) || (cadence && dateMatchesRecurringSchedule(eventDate, recurringDay, cadence, recurringTime));
    const isASeries = occurrenceExists && (cadence || await getIsASeries(id, type));
    if (!occurrenceExists || !isASeries) redirect(`/${pluralize(type)}/${id}`);

    return <>
        {occurrence?.cancelled ? <h2 className="text-right text-red-800 dark:text-red-300 text-lg text-semibold">Cancelled Event</h2> : null}
        <EventHeader event={parentEvent}>
            <EventDate eventDate={eventDate} type={type} />
            <Link className="link pb-2 text-sm mt-[-4px]" href={`/${pluralize(type)}/${id}`}>Go to parent {type} page</Link>
        </EventHeader>
        <Occurrence type={type} id={id} dateTime={eventDate} parentEvent={parentEvent} isASeries />
        <EventDetails type={type} event={parentEvent} />
    </>
}