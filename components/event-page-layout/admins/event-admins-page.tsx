import { postEventAdmins } from "@/actions";
import AdminsInputs from "@/components/form/admin-inputs";
import { getEvent } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";
import EventHeader from "../event-header";
import { EventType } from "@/types";
import { capitalize, pluralize } from "@/lib/helper-functions";

export default async function EventAdminsPage({ id, type }: { id: string, type: EventType }) {
    const event = await getEvent(id, type);

    if (!event) notFound();

    const { admins } = event;
    const userId = await getCurrentUserId();
    const isAdmin = userId && admins.includes(userId);

    if (!isAdmin) notFound();

    const onCancel = async () => {
        'use server'
        redirect(`/${pluralize(type)}/${id}`);
    }

    return <>
        <EventHeader event={event} />
        <div className="mb-4">
            <h3 className="mt-3 mb-3 font-semibold text-sm">{capitalize(type)} Page Admins</h3>
            <AdminsInputs
                currentAdmins={admins}
                onSubmit={postEventAdmins.bind(null, type, id)}
                cancel={onCancel}
            />
        </div>
    </>
}