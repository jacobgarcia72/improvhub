import { optimizeImage } from "@/lib/optimize-image";
import { getFriendship, getUser, getUserAbbreviated } from "@/lib/users";
import { EventType, Notification, Role } from "@/types";
import Image from "next/image";
import Link from "next/link";
import FriendRequestButtons from "./friend-request-buttons";
import { getTroupe, getTroupeMembership } from "@/lib/troupes";
import { getPronounForm } from "@/lib/demographics";
import TroupeRequestButtons from "./troupe-request-buttons";
import { getVerbFromRole, pluralize } from "@/lib/helper-functions";
import { getEvent, getShow } from "@/lib/shows";
import { formatDateTimeForDisplay } from "@/lib/dates";

function Wrapper({ children, date, image, imageLink, imageAlt, isNew }: { children: React.ReactNode, date: string, image?: string | null, imageLink?: string, imageAlt?: string, isNew: boolean }) {
    return (
        <div className={`border-b border-b-black/20 p-2 ${isNew ? 'bg-cyan-500/10' : ''}`}>
            <div className="flex flex-row gap-2 items-start">
                <div className="w-12 h-12">
                    {image && imageLink && imageAlt ? <Link href={imageLink}>
                        <Image
                            src={optimizeImage(image, 100, 100, 90, true)}
                            alt={imageAlt} width={50} height={50}
                            className="rounded"
                        />
                    </Link> : null}
                </div>
                <div className="w-full">
                    {children}
                    <p className="ml-1 text-xs text-mist-500">{formatDateTimeForDisplay(date)}</p>
                </div>
            </div>
        </div>
    )
}

export default async function NotificationCard({ notification, userId, isNew }: { notification: Notification, userId: string, isNew: boolean }) {
    const { date, type, sender: senderId, id: notifId, data } = notification;
    let innerContent: React.ReactNode;
    switch (type) {
        case 'friend_request':
            const sender = await getUserAbbreviated(senderId);
            if (!sender) return null;
            const friendship = await getFriendship(userId, senderId);
            if (friendship === null) {
                return null;
            } else if (friendship?.accepted) {
                innerContent = (
                    <p>
                        You and&nbsp;
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender.name}
                        </Link>
                        &nbsp;are now friends!
                    </p>
                )
            } else {
                innerContent = (
                    <div className="flex flex-col gap-1">
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender.name}
                            </Link>
                            &nbsp;sent you a friend request!
                        </p>
                        <FriendRequestButtons yourId={userId} thierId={senderId} notifId={notifId} />
                    </div>
                )
            }
            return (
                <Wrapper date={date} isNew={isNew} image={sender.image} imageLink={`/profile/${senderId}`} imageAlt={sender.name}>
                    {innerContent}
                </Wrapper>
            )
        case 'friend_request_accept':
            const sender2 = await getUserAbbreviated(senderId);
            if (!sender2) return null;
            return (
                <Wrapper date={date} isNew={isNew} image={sender2.image} imageLink={`/profile/${senderId}`} imageAlt={sender2.name}>
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender2.name}
                            </Link>
                            &nbsp;accepted your friend request
                        </p>
                </Wrapper>
            )
        case 'added_to_troupe':
            const sender3 = await getUserAbbreviated(senderId);
            if (!sender3) return null;
            if (!data) return null;
            const [troupeId, role] = data.split(',');
            const troupe = await getTroupe(troupeId);
            const pronouns = (await getUser(senderId))?.pronouns;
            const membership = await getTroupeMembership(userId, troupeId, role as Role);
            if (!troupe || !membership) return null;
            const hasConfirmed = membership.confirmed;
            if (hasConfirmed) {
                innerContent = (
                    <p>
                        You accepted&nbsp;
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender3.name}
                        </Link>
                        &apos;s invitation to {getVerbFromRole(role as Role)} &nbsp;
                        <Link href={`/troupes/${troupe.id}`} className="link">
                            {troupe.name}
                        </Link>
                    </p>
                )
            } else {
                innerContent = (
                    <div className="flex flex-col gap-1">
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender3.name}
                            </Link>
                            &nbsp;has invited you to&nbsp;{getVerbFromRole(role as Role)}&nbsp;{getPronounForm(pronouns, 2)}&nbsp;troupe,&nbsp;
                            <Link href={`/troupes/${troupe.id}`} className="link">
                                {troupe.name}
                            </Link>!
                        </p>
                        <TroupeRequestButtons notifId={notifId} troupeId={troupeId} userId={userId} role={role} />
                    </div>
                )
            }
            return (
                <Wrapper date={date} isNew={isNew} image={troupe.image || sender3.image} imageLink={troupe.image ? `/troupes/${troupe.id}` : `/profile/${senderId}`} imageAlt={troupe.image ? troupe.name : sender3.name}>
                    {innerContent}
                </Wrapper>
            )
        case 'confirmed_troupe':
            const sender4 = await getUserAbbreviated(senderId);
            if (!sender4) return null;
            if (!data) return null;
            const [troupeId2, role2] = data.split(',');
            const troupe2 = await getTroupe(troupeId2);
            const membership2 = await getTroupeMembership(senderId, troupeId2, role2 as Role);
            if (!troupe2 || !membership2) return null;
            return (
                <Wrapper date={date} isNew={isNew} image={sender4.image || troupe2.image} imageLink={sender4.image ? `/profile/${senderId}` : `/troupes/${troupe2.id}`} imageAlt={sender4.image ? sender4.name : troupe2.name}>
                    <p>
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender4.name}
                        </Link>
                        &nbsp;accepted your invitation to {getVerbFromRole(role2 as Role)}&nbsp;
                        <Link href={`/troupes/${troupe2.id}`} className="link">
                            {troupe2.name}
                        </Link>
                    </p>
                </Wrapper>
            )
        case 'cast_in_show':
            if (!data) return null;
            const [showDateTime, role3, troupeId3] = data.split(',');
            const show = await getShow(senderId);
            if (!show) return null;
            if (role3 === 'troupe') {
                const troupe = await getTroupe(troupeId3);
                if (!troupe) return null;
                return (
                    <Wrapper date={date} isNew={isNew} image={show.image || troupe.image} imageLink={show.image ? `/shows/${senderId}` : `/troupes/${troupe.id}`} imageAlt={show.image ? show.title : troupe.name}>
                        <p>
                            Your troupe, <Link href={`/troupes/${troupe.id}/`} className="link">
                                {troupe.name}
                            </Link>, has been cast to play in&nbsp;
                            <Link href={`/shows/${show.id}/${showDateTime}`} className="link">
                                {show.title}
                            </Link> on {formatDateTimeForDisplay(showDateTime)}
                        </p>
                    </Wrapper>
                )
            } else {
                return (
                    <Wrapper date={date} isNew={isNew} image={show.image} imageLink={`/shows/${senderId}`} imageAlt={show.title}>
                        <p>
                            You&apos;ve been cast as a&nbsp;{role3}&nbsp;in&nbsp;
                            <Link href={`/shows/${show.id}/${showDateTime}`} className="link">
                                {show.title}
                            </Link> on {formatDateTimeForDisplay(showDateTime)}
                        </p>
                    </Wrapper>
                )
            }
        case 'show_drop_out':
            if (!data) return null;
            const [showId, showDateTime2, role4] = data.split(',');
            const show2 = await getShow(showId);
            const isTroupe = role4 === 'troupe';
            const dropOut = isTroupe ? await getTroupe(senderId) : await getUserAbbreviated(senderId);
            if (!show2 || !dropOut) return null;
            let verb = '';
            if (role4 === 'director') verb = ' directing';
            if (role4 === 'tech') verb = ' teching';
            if (role4 === 'musician') verb = ' accompanying';
            return (
                    <Wrapper date={date} isNew={isNew} image={show2.image} imageLink={`/shows/${show2.id}`} imageAlt={show2.title}>
                        <p>
                            <Link href={`/${isTroupe ? 'troupes' : 'profile'}/${dropOut.id}/`} className="link">
                                {dropOut.name}
                            </Link>
                            &nbsp;{isTroupe ? 'have' : 'has'} dropped out of{verb}&nbsp;
                            <Link href={`/shows/${show2.id}/${showDateTime2}`} className="link">
                                {show2.title}
                            </Link> on {formatDateTimeForDisplay(showDateTime2)}
                        </p>
                    </Wrapper>
                )
        case 'show_occurrence_cancelled':
        case 'jam_occurrence_cancelled':
        case 'workshop_occurrence_cancelled':
        case 'class_occurrence_cancelled':
            if (!data) return null;
            const cancelledEventType = type.split('_')[0] as EventType;
            const cancelledEvent = await getEvent(senderId, cancelledEventType);
            const [cancelledEventTitle, cancelledDateTime] = data.split(',');
            return <Wrapper date={date} isNew={isNew} image={cancelledEvent?.image} imageLink={`/${pluralize(cancelledEventType)}/${senderId}/${cancelledDateTime}`} imageAlt={cancelledEventTitle}>
                <p>
                    {cancelledEvent ? <Link href={`/${pluralize(cancelledEventType)}/${senderId}/`} className="link">
                        {cancelledEvent.title}
                    </Link> : <>{cancelledEventTitle}</>}, {formatDateTimeForDisplay(cancelledDateTime)}, has been cancelled
                </p>
            </Wrapper>
        case 'show_cancelled':
        case 'jam_cancelled':
        case 'class_cancelled':
        case 'workshop_cancelled':
            if (!data) return null;
            return <Wrapper date={date} isNew={isNew}>
                <p>{data} has been cancelled</p>
            </Wrapper>
        default:
            break;
    }
    return null;
}
