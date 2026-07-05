import EventDate from "@/components/event-page-layout/[dateTime]/event-date";
import EventHeader from "@/components/event-page-layout/event-header";
import FollowerList from "@/components/follower-list";
import { pluralize, singularize } from "@/lib/helper-functions";
import { getEvent, getFriendsRsvp } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { EventType } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function RSVPPage({ params }:
    { params: Promise<{ id: string, dateTime: string, events: string }> }
) {
    const { id, dateTime, events } = await params;
    const type = singularize(events);
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    const showDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const userId = await getCurrentUserId();
    const event = await getEvent(id, type as EventType);
    if (!userId || !event) notFound();
    const friendsGoing = await getFriendsRsvp(id, showDate, 'g', type as EventType, userId);
    const friendsInterested = await getFriendsRsvp(id, showDate, 'i', type as EventType, userId);
    return (
        <>
            <EventHeader event={event}>
                <EventDate eventDate={showDate} type={type as EventType} />
                <Link className="link pb-2 text-sm mt-[-4px]" href={`/${pluralize(type)}/${id}`}>Go to parent {type} page</Link>
            </EventHeader>
            <div className="px-6">
                <Link href={`/${events}/${id}/${dateTime}`} className="link">Back</Link>
                {friendsGoing.length ? <FollowerList followers={friendsGoing} caption={`Friends Going`} /> : null}
                {friendsInterested.length ? <FollowerList followers={friendsInterested} caption={`Friends Interested`} /> : null}
                {(friendsGoing.concat(friendsInterested)).length > 50 && (
                    <div className="pt-4">
                        <Link href={`/${events}/${id}/${dateTime}`} className="link">Back</Link>
                    </div>
                )}
            </div>
        </>
    )
}