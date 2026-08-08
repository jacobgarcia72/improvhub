import { getFriendsRsvpCount, getRsvpCount, getRsvpStatus, getShowCast, getTroupeCastConfirmation } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import CastingTools from "./casting-tools";
import CastList from "@/components/cast-list";
import { Event, EventType, ShowCastMember, Troupe } from "@/types";
import CastRoleBanner from "./cast-role-banner";
import { getTroupesByUser } from "@/lib/troupes";
import CancelOccurrence from "./cancel-occurrence";
import RSVP from "./rsvp";
import AddToCalendarButton from "./add-to-calendar";
import { getTheatre } from "@/lib/theatres";
import { Suspense } from "react";
import Loader from "@/components/loader";
import Link from "next/link";
import { pluralize } from "@/lib/helper-functions";

export default async function Occurrence({ id, dateTime, parentEvent, isASeries, type } :
    { id: string, dateTime: string, parentEvent: Event, isASeries: boolean, type: EventType }
) {
    const eventDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');

    const userId = await getCurrentUserId();
    const isAdmin = userId && parentEvent?.admins.includes(userId);

    const showCast: ShowCastMember[] = type === 'show' ? await getShowCast(id, dateTime) : [];
    const userRoles = (type === 'show' && userId) ? (
        showCast.filter((c) => c.id === userId).map((c) => c.role)
    ) : null;
    let userTroupes: { troupe: Troupe, confirmed: Awaited<ReturnType<typeof getTroupeCastConfirmation>> }[] = [];
    if (type === 'show' && userId) {
        const troupes = await getTroupesByUser(userId);
        const troupeIds = troupes.map((troupe) => troupe.id);
        userTroupes = (await Promise.all(showCast
            .filter((c) => c.id && c.role === 'troupe' && troupeIds.includes(c.id))
            .map(async (c) => {
                const troupe = troupes.find((t) => t.id === c.id);
                if (!troupe || !c.id) return null;
                const confirmed = await getTroupeCastConfirmation(userId, c.id, id, eventDate);
                return { troupe, confirmed };
            })
        )).filter((t) => t !== null);
    }
    const isDirector = userRoles?.includes('director');

    const rsvp = userId && !userRoles?.length ? await getRsvpStatus(userId, parentEvent.id, eventDate, type) : null;

    const goingCount = await getRsvpCount(parentEvent.id, eventDate, 'g', type);
    const interestedCount = await getRsvpCount(parentEvent.id, eventDate, 'i', type);
    const friendsGoingCount = (userId && goingCount) ? await getFriendsRsvpCount(parentEvent.id, eventDate, 'g', type, userId) : 0;
    const friendsInterestedCount = (userId && interestedCount) ? await getFriendsRsvpCount(parentEvent.id, eventDate, 'i', type, userId) : 0;

    let location = parentEvent.theatre && (await getTheatre(parentEvent.theatre))?.name || undefined;
    if (location && parentEvent.city && parentEvent.state) location += `, ${parentEvent.city} ${parentEvent.state}`;
    return <Suspense fallback={<Loader />}>
        <div className="flex flex-col pb-3 border-b border-gray-400 mb-2">
            {userRoles?.length ? userRoles.map((role) => (
                <CastRoleBanner
                    showTitle={parentEvent.title}
                    roleId={userId}
                    showId={id}
                    dateTime={dateTime}
                    role={role}
                    key={role}
                />
            )) : null}
            {userTroupes?.length ? userTroupes.map(({ troupe, confirmed }) => (
                <CastRoleBanner
                    troupeName={troupe.name}
                    showTitle={parentEvent.title}
                    roleId={troupe.id}
                    showId={id}
                    dateTime={dateTime}
                    role='troupe'
                    troupeConfirmed={confirmed}
                    key={troupe.id}
                />
            )) : null}
            <div className="pt-1 pb-1 px-6">
                <div className="w-full flex flex-row flex-wrap items-center justify-between items-start">
                    <div className="mb-3">
                        <AddToCalendarButton event={parentEvent} date={eventDate} location={location} />
                    </div>
                    <div className="flex flex-col items-end">
                        {userId && !userRoles?.length ? (
                            <RSVP
                                userId={userId}
                                eventId={parentEvent.id}
                                eventDate={eventDate}
                                rsvp={rsvp}
                                type={type}
                            />
                        ) : null}
                        {goingCount > 0 && <p className="label mr-4">{`${goingCount} Going`}{friendsGoingCount ? <>, including <Link href={`/${pluralize(type)}/${id}/${dateTime}/friends`} className="link">{friendsGoingCount} {pluralize('Friend', friendsGoingCount)}</Link></> : null}</p>}
                        {interestedCount > 0 && <p className="label mr-4">{`${interestedCount} Interested`}{friendsInterestedCount ? <>, including <Link href={`/${pluralize(type)}/${id}/${dateTime}/friends`} className="link">{friendsInterestedCount} {pluralize('Friend', friendsInterestedCount)}</Link></> : null}</p>}
                    </div>
                </div>
            </div>
            {type === 'show' && <>
                <div className="mb-6">
                    <CastList castMembers={showCast} noConfirm />
                </div>
                {(isAdmin || isDirector) ? (
                    <CastingTools id={id}
                        showDate={eventDate}
                    />
                ) : null}
            </>}
            {isAdmin && isASeries && <div className="w-full flex flex-row justify-center mt-2">
                <CancelOccurrence
                    eventTitle={parentEvent.title}
                    eventId={id}
                    dateTime={dateTime}
                    type={type}
                />
            </div>}
        </div>
    </Suspense>
}
