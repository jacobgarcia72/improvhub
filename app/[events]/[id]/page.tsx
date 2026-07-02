import EventDetailsPage from "@/components/event-page-layout/event-details-page";
import { singularize } from "@/lib/helper-functions";
import { EventType } from "@/types";
import { notFound } from "next/navigation";

export default async function JamDetailsPage({ params }: {params: Promise<{ id: string, events: string }>}) {
    const { id, events } = await params;
    const type = singularize(events);
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    return <EventDetailsPage id={id} type={type as EventType} />
}