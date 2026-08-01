import { getSubmissionForm, getSubmissions } from "@/lib/submission-forms";
import { assignSubmissionsToAuditionSlots } from "@/lib/submission-form-utils";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId, getUserAbbreviated } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AuditionSlotsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await getCurrentUserId();
    const members = await getTroupeMembers(id);
    const canManage = userId && members.some((member) => member.id === userId && member.confirmed && member.role !== 'coach');
    if (!canManage) notFound();

    const form = await getSubmissionForm('troupe', id);
    if (!form || !form.hasAudition || form.auditionDatesTbd) notFound();

    const submissions = await getSubmissions(form.id);
    const assignment = assignSubmissionsToAuditionSlots(form, submissions);
    const userIds = [...new Set(submissions.map((submission) => submission.userId).filter((uid) => uid !== null))];
    const users = await Promise.all(userIds.map((uid) => getUserAbbreviated(uid)));
    const getSubmitterName = (submission: { userId: string | null, contactEmail: string | null }) => {
        if (!submission.userId) return submission.contactEmail || 'Unknown submitter';
        return users.find((user) => user?.id === submission.userId)?.name || submission.userId;
    };

    return (
        <section className="medium-section">
            <Link className="link text-sm" href={`/troupes/${id}/submissions`}>Back to submissions</Link>
            <h1 className="text-xl mt-2 mb-4">Audition Slot Assignment</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assignment.slots.map(({ slot, submissions: assigned }) => (
                    <div key={slot.id} className="rounded border border-gray-300 p-3">
                        <h2 className="font-semibold text-slate-700 dark:text-slate-300">
                            {formatDateTimeForDisplay(slot.dateTime, true)}
                        </h2>
                        {assigned.length ? assigned.map((submission) => (
                            <Link
                                key={submission.id}
                                className="link block"
                                href={`/troupes/${id}/submissions/${submission.id}`}
                            >
                                {getSubmitterName(submission)}
                            </Link>
                        )) : <p className="text-sm text-slate-500">No one assigned.</p>}
                    </div>
                ))}
            </div>
            {assignment.unassigned.length ? (
                <div className="mt-5">
                    <h2 className="font-semibold text-slate-700 dark:text-slate-300">Unassigned</h2>
                    {assignment.unassigned.map((submission) => (
                        <Link
                            key={submission.id}
                            className="link block"
                            href={`/troupes/${id}/submissions/${submission.id}`}
                        >
                            {getSubmitterName(submission)}
                        </Link>
                    ))}
                </div>
            ) : null}
        </section>
    )
}
