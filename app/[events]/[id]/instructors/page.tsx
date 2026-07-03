import EventInstructorsPage from "@/components/event-page-layout/instructors/event-admins-page";
import { singularize } from "@/lib/helper-functions";
import { EventType } from "@/types";
import { notFound } from "next/navigation";

export default async function InstructorsPage({ params }: {params: Promise<{ id: string, events: string }>}) {
    const { id, events } = await params;
    const type = singularize(events);
    if (!['jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    return <EventInstructorsPage id={id} type={type as EventType} />
}