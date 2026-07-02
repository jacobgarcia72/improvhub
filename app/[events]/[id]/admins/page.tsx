import EventAdminsPage from "@/components/event-page-layout/admins/event-admins-page";
import { singularize } from "@/lib/helper-functions";
import { EventType } from "@/types";
import { notFound } from "next/navigation";

export default async function AdminsPage({ params }: {params: Promise<{ id: string, events: string }>}) {
    const { id, events } = await params;
    const type = singularize(events);
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    return <EventAdminsPage id={id} type={type as EventType} />
}