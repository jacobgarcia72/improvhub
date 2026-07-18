import Button from "@/components/form/button";
import { UserLink } from "@/components/user-link";
import { getEvent, getEventOccurrences } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import EventDetails from "./event-details";
import DeleteEvent from "./delete-event";
import EventHeader from "./event-header";
import EventOccurrence from "./[dateTime]/occurrence";
import EventDate from "./[dateTime]/event-date";
import { capitalize, pluralize } from "@/lib/helper-functions";
import { EventType } from "@/types";

export default async function EventDetailsPage({ id, type }: { id: string, type: EventType }) {
    const event = await getEvent(id, type);

    if (!event) notFound();

    const { admins, instructors } = event;
    const userId = await getCurrentUserId();
    const isAdmin = userId && admins.includes(userId);
    const isInstructor = userId && instructors?.includes(userId);

    const occurrences = event.recurringTime ? null : await getEventOccurrences(id, type);
    const onlyOneOccurrence = occurrences?.length === 1;

    const capType = capitalize(type);

    return <>
        <EventHeader event={event}>{onlyOneOccurrence ? <EventDate type={type} eventDate={occurrences[0].dateTime} /> : <h3 className="font-semibold font-lg pt-2 pb-0">{capType} Series</h3>}</EventHeader>
        {onlyOneOccurrence && <EventOccurrence type={type} id={id} dateTime={occurrences[0].dateTime} parentEvent={event} isASeries={false} />}
        <EventDetails event={event} type={type} />
        {isAdmin || isInstructor ? <div className="px-3 pb-3 mt-3 bg-gray-500/30 border border-gray-500 rounded">
            <div className="flex justify-center"><h2 className="my-2">Admin Panel</h2></div>
            <div className="flex flex-row flex-wrap-reverse gap-2 justify-center">
                <div>
                    <Link href={`/${pluralize(type)}/${id}/admins`}>
                        <Button caption="Manage Admins" className="w-54" />
                    </Link>
                    <h3 className="mt-3 mb-1 font-semibold text-sm">Page Admins</h3>
                    {admins.map((admin, i) => (
                        <UserLink key={i} userId={admin} />
                    ))}
                </div>
                {['jam', 'class', 'workshop'].includes(type) && (
                        <div>
                            <Link href={`/${pluralize(type)}/${id}/instructors`}>
                                <Button caption={`Manage ${type === 'jam' ? 'Hosts' : 'Instructors'}`} className="w-54" />
                            </Link>
                        </div>
                )}
                <div>
                    <Link href={`/manage/${type}/${id}`}>
                        <Button caption="Edit Details" className="w-54" />
                    </Link>
                </div>
            </div>
            {type === 'show' && !onlyOneOccurrence && (
                <div className="w-full flex justify-center">
                    <div className="flex justify-center px-3 py-3 border border-gray-700 bg-slate-200 dark:bg-slate-800 rounded">
                        <p className="text-sm">
                            <span className="font-semibold">Admin Note:</span> This is a show series. To manage casting of individual showing, select a date above.
                        </p>
                    </div>
                </div>
            )}
            {isAdmin && <DeleteEvent type={type} eventId={event.id} eventTitle={event.title} isASeries={!onlyOneOccurrence} />}
        </div> : null}
    </>
}