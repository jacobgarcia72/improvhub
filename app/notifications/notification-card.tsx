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
import { getEvent, getShow, getTroupeCastConfirmation } from "@/lib/shows";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { getSubmissionById, getSubmissionFormById } from "@/lib/submission-forms";
import TroupeCastConfirmationButtons from "@/components/troupe-cast-confirmation-buttons";

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
                <div className="w-full leading-snug">
                    {children}
                    <p className="ml-1 mt-1 text-xs text-mist-500">{formatDateTimeForDisplay(date)}</p>
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
                const confirmed = await getTroupeCastConfirmation(userId, troupe.id, show.id, showDateTime);
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
                        <TroupeCastConfirmationButtons
                            troupeId={troupe.id}
                            showId={show.id}
                            dateTime={showDateTime}
                            initialConfirmed={confirmed}
                        />
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
        case 'made_instructor':
        case 'made_admin':
            if (!data) return null;
            const [instructorEventType, instructorEventId] = data.split(',');
            const instructorAddedBy = await getUserAbbreviated(senderId);
            const instructorEvent = await getEvent(instructorEventId, instructorEventType as EventType);
            if (!instructorEvent) return null;
            let instructorTitle = 'an admin';
            if (type === 'made_instructor') {
                instructorTitle = instructorEventType === 'jam' ? 'a host' : 'an instructor';
            }
            return <Wrapper date={date} isNew={isNew} image={instructorEvent.image || instructorAddedBy?.image} imageLink={instructorEvent.image ? `/${pluralize(instructorEventType)}/${instructorEventId}` : `/profile/${senderId}`} imageAlt={instructorEvent.image ? instructorEvent.title : instructorAddedBy?.name}>
                <p>
                    {instructorAddedBy ? <>
                        <Link href={`/profile/${senderId}`} className="link">
                            {instructorAddedBy.name}
                        </Link> added you as {instructorTitle}
                    </> : <>
                        You&apos;ve been added  as {instructorTitle}
                    </>} for <Link className="link" href={`/${pluralize(instructorEventType)}/${instructorEventId}`}>{instructorEvent.title}</Link>
                </p>
            </Wrapper>
        case 'new_comment':
            if (!data) return null;
            const [room, topicId, postId] = data.split(',');
            const commenter = await getUserAbbreviated(senderId);
            return <Wrapper date={date} isNew={isNew} image={commenter?.image} imageLink={`/profile/${senderId}`} imageAlt={commenter?.name}>
                <p>
                    {commenter ? (
                        <Link href={`/profile/${senderId}`} className="link">
                            {commenter.name}
                        </Link>
                    ) : 'Someone'}
                    &nbsp;commented on&nbsp;
                    <Link href={`/discuss?channel=${room}&topic=${topicId}&post=${postId}`} className="link">
                        your post
                    </Link>
                </p>
            </Wrapper>
        case 'new_post_in_troupe_channel':
            if (!data) return null;
            const [room2, topicId2, postId2] = data.split(',');
            const troupeId4 = room2.replace('troupe-', '');
            const troupe4 = await getTroupe(troupeId4);
            const commenter2 = await getUserAbbreviated(senderId);
            return <Wrapper date={date} isNew={isNew} image={commenter2?.image} imageLink={`/profile/${senderId}`} imageAlt={commenter2?.name}>
                <p>
                    {commenter2 ? (
                        <Link href={`/profile/${senderId}`} className="link">
                            {commenter2.name}
                        </Link>
                    ) : 'Someone'}
                    &nbsp;posted a&nbsp;<Link href={`/discuss?channel=${room2}&topic=${topicId2}&post=${postId2}`} className="link">
                        new message
                    </Link>&nbsp;in&nbsp;
                    {troupe4 ? (
                        <Link href={`/troupes/${troupeId4}`} className="link">
                            {troupe4.name}
                        </Link>
                    ) : 'your troupe'}&apos;s channel
                </p>
            </Wrapper>
        case 'new_submission_form':
            if (!data) return null;
            const submissionForm = await getSubmissionFormById(data);
            if (!submissionForm || submissionForm.ownerType !== 'troupe') return null;
            const submissionTroupe = await getTroupe(submissionForm.ownerId);
            if (!submissionTroupe) return null;
            return <Wrapper date={date} isNew={isNew} image={submissionTroupe.image} imageLink={`/troupes/${submissionTroupe.id}`} imageAlt={submissionTroupe.name}>
                <p>
                    <Link href={`/troupes/${submissionTroupe.id}`} className="link">
                        {submissionTroupe.name}
                    </Link>
                    &nbsp;is {submissionForm.hasAudition ? 'holding auditions' : 'taking submissions'}&nbsp;for new members!&nbsp;
                    <Link href={`/submission-form/troupe/${submissionTroupe.id}`} className="link">
                        View submission form
                    </Link>
                </p>
            </Wrapper>
        case 'new_submission':
            if (!data) return null;
            const [submittedFormId, submissionId] = data.split(',');
            const submittedForm = await getSubmissionFormById(submittedFormId);
            const submission = submissionId ? await getSubmissionById(submissionId) : null;
            if (!submittedForm || submittedForm.ownerType !== 'troupe' || !submission) return null;
            const submittedTroupe = await getTroupe(submittedForm.ownerId);
            if (!submittedTroupe) return null;
            const submitter = submission.userId ? await getUserAbbreviated(submission.userId) : null;
            return <Wrapper
                date={date}
                isNew={isNew}
                image={submitter?.image || submittedTroupe.image}
                imageLink={submitter ? `/profile/${submitter.id}` : `/troupes/${submittedTroupe.id}`}
                imageAlt={submitter?.name || submittedTroupe.name}
            >
                <p>
                    {submitter ? (
                        <Link href={`/profile/${submitter.id}`} className="link">
                            {submitter.name}
                        </Link>
                    ) : submission.answers.name || submission.contactEmail || 'Someone'}
                    &nbsp;filled out&nbsp;
                    <Link href={`/troupes/${submittedTroupe.id}`} className="link">
                        {submittedTroupe.name}
                    </Link>
                    &apos;s submission form.&nbsp;<Link href={`/troupes/${submittedTroupe.id}/submissions/${submission.id}`} className="link">View submission</Link>
                </p>
            </Wrapper>
        case 'audition_slot_assigned':
            if (!data) return null;
            const [auditionFormId, auditionSubmissionId, auditionSlotId] = data.split(',');
            const auditionForm = await getSubmissionFormById(auditionFormId);
            const auditionSubmission = auditionSubmissionId ? await getSubmissionById(auditionSubmissionId) : null;
            if (!auditionForm || auditionForm.ownerType !== 'troupe' || auditionSubmission?.userId !== userId) return null;
            const auditionTroupe = await getTroupe(auditionForm.ownerId);
            const auditionSlot = auditionForm.auditionSlots.find((slot) => slot.id === auditionSlotId);
            if (!auditionTroupe || !auditionSlot) return null;
            return <Wrapper
                date={date}
                isNew={isNew}
                image={auditionTroupe.image}
                imageLink={`/troupes/${auditionTroupe.id}`}
                imageAlt={auditionTroupe.name}
            >
                <p>
                    You&apos;ve been assigned an audition time for <Link href={`/troupes/${auditionTroupe.id}`} className="link">
                        {auditionTroupe.name}
                    </Link>! Your audition will take place on {formatDateTimeForDisplay(auditionSlot.dateTime, false, true, true)}.
                </p>
            </Wrapper>
        default:
            break;
    }
    return null;
}
