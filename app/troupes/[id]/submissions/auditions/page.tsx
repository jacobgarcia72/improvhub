import { getSubmissionForm, getSubmissions } from "@/lib/submission-forms";
import { getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId, getUserAbbreviated } from "@/lib/users";
import AuditionSlotsClient from "./audition-slots-client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubmissionFormSubmission } from "@/types";

export default async function AuditionSlotsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await getCurrentUserId();
    const members = await getTroupeMembers(id);
    const canManage = userId && members.some((member) => member.id === userId && member.confirmed && member.role !== 'coach');
    if (!canManage) notFound();

    const form = await getSubmissionForm('troupe', id);
    if (!form || !form.hasAudition || form.auditionDatesTbd) notFound();

    const submissions = await getSubmissions(form.id);
    const userIds = [...new Set(submissions.map((submission) => submission.userId).filter((uid) => uid !== null))];
    const users = await Promise.all(userIds.map((uid) => getUserAbbreviated(uid)));
    const getSubmitterName = (submission: SubmissionFormSubmission) => {
        if (!submission.userId) return submission.answers.name as string || submission.contactEmail || 'Unknown submitter';
        return users.find((user) => user?.id === submission.userId)?.name || submission.userId;
    };

    return (
        <section className="px-10! sm:px-16! flex flex-col gap-4">
            <h1 className="text-lg">Audition Slot Assignment</h1>
            <AuditionSlotsClient
                troupeId={id}
                formId={form.id}
                slots={form.auditionSlots}
                submissions={submissions.map((submission) => ({
                    id: submission.id,
                    name: getSubmitterName(submission),
                    image: submission.userId
                        ? users.find((user) => user?.id === submission.userId)?.image
                        : undefined,
                    href: `/troupes/${id}/submissions/${submission.id}`,
                    auditionAvailability: submission.auditionAvailability,
                    assignedAuditionSlotId: submission.assignedAuditionSlotId
                }))}
            />
            <Link className="link" href={`/troupes/${id}/submissions`}>Back</Link>
        </section>
    )
}
