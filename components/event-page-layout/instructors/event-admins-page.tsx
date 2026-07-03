import { postEventInstructors } from "@/actions";
import AdminsInputs from "@/components/form/admin-inputs";
import { getEvent } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";
import EventHeader from "../event-header";
import { EventType } from "@/types";
import { capitalize, pluralize } from "@/lib/helper-functions";

export default async function EventInstructorsPage({ id, type }: { id: string, type: EventType }) {
    if (!['jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    const event = await getEvent(id, type);
    if (!event) notFound();

    const { admins, instructors } = event;
    const userId = await getCurrentUserId();
    const isAdmin = userId && admins.includes(userId);
    const isInstructor = userId && instructors?.includes(userId);

    if (!(isAdmin || isInstructor)) notFound();

    const onCancel = async () => {
        'use server'
        redirect(`/${pluralize(type)}/${id}`);
    }
    const label = type === 'jam' ? 'Host' : 'Instructor';
    return <>
        <EventHeader event={event} />
        <div className="mb-4">
            <h3 className="mt-3 mb-3 font-semibold text-sm">{capitalize(type)} {pluralize(label)}</h3>
            <AdminsInputs
                label={label}
                currentAdmins={instructors || []}
                onSubmit={postEventInstructors.bind(null, type, id)}
                cancel={onCancel}
            />
        </div>
    </>
}