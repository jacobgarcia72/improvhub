import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import CastList from "@/components/cast-list";
import { getCurrentUserId, getFollowCount } from "@/lib/users";
import Link from "next/link";
import Button from "@/components/form/button";
import { pluralize } from "@/lib/helper-functions";
import AvailableUsersSection from "../available-users-section";
import UpcomingShows from "@/components/upcoming-shows";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { getSubmission, getSubmissionForm } from "@/lib/submission-forms";
import { formatDateTimeForDisplay, isDateTimeInPast } from "@/lib/dates";

type Props = {
    params: Promise<{ id: string }>
}
export default async function TroupePage({ params }: Props) {
    const { id } = await params;
    const members = await getTroupeMembers(id, true);
    const currentUserId = await getCurrentUserId();
    const isMemberNotCoach = currentUserId && members.some(
        (member) => member.id === currentUserId && member.confirmed && member.role !== 'coach'
    );
    const followerCount = await getFollowCount(id, 'troupe');
    const troupe = await getTroupe(id);
    const submissionForm = await getSubmissionForm('troupe', id);
    const hasOpenSubmissionForm = submissionForm && !isDateTimeInPast(submissionForm.closesAt);
    const submission = hasOpenSubmissionForm && currentUserId
        ? await getSubmission(submissionForm.id, currentUserId)
        : null;
    const assignedAuditionSlot = submission?.assignedAuditionSlotId
        ? submissionForm?.auditionSlots.find((slot) => slot.id === submission.assignedAuditionSlotId)
        : null;
    const assignedAuditionTime = assignedAuditionSlot && !isDateTimeInPast(assignedAuditionSlot.dateTime)
        ? formatDateTimeForDisplay(assignedAuditionSlot.dateTime, false, true, true)
        : null;

    return <>
        {hasOpenSubmissionForm ? <section className="flex flex-col items-center gap-2">
            {assignedAuditionTime ? (
                <h3>You have an upcoming audition for this troupe on {assignedAuditionTime}.</h3>
            ) : <>
                <h3>This troupe is {submissionForm.hasAudition ? 'holding auditions' : 'taking submissions'}!</h3>
                <Link href={`/submission-form/troupe/${id}`}>
                    <Button caption="Submission Form" className="w-54 max-w-[45vw] px-0!" />
                </Link>
            </>}
        </section> : null}
        {followerCount ? (
            <section>
                <Link href={`/troupes/${id}/followers`} className="link ml-8">
                    {`${followerCount} ${pluralize('Follower', followerCount)}`}
                </Link>
            </section>
        ) : null}
        <section>
            {isMemberNotCoach || hasOpenSubmissionForm ? <>
                <div className="flex flex-row flex-wrap gap-2 justify-center mb-2">
                    {isMemberNotCoach ? <>
                        <Link href={`/troupes/${id}/manage-members`}>
                            <Button caption="Manage Members" className="w-54 max-w-[45vw] px-0!" />
                        </Link>
                        <Link href={`/manage/troupe/${id}`}>
                            <Button caption="Manage Troupe Details" className="w-54 max-w-[45vw] px-0!" />
                        </Link>
                        <Link href={`/troupes/${id}/submissions`}>
                            <Button caption="Submissions" className="w-54 max-w-[45vw] px-0!" />
                        </Link>
                    </> : null}
                </div>
            </> : null}
            <Suspense fallback={<Loader caption="troupe members" />}>
                <CastList castMembers={members} noConfirm={Boolean(isMemberNotCoach)} />
            </Suspense>
        </section>
        <UpcomingShows id={id} roles={['troupe']} limit={6} />
        {isMemberNotCoach ? <>
            {troupe?.lookingForPlayers && <AvailableUsersSection role="player" troupe={troupe} />}
            {troupe?.lookingForMusician && <AvailableUsersSection role="musician" troupe={troupe} />}
            {troupe?.lookingForCoach && <AvailableUsersSection role="coach" troupe={troupe} />}
        </> : null}
    </>
}
