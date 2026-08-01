import { getSubmissionById, getSubmissionForm } from "@/lib/submission-forms";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId, getUserAbbreviated } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";

function Answer({ value }: { value: string | string[] | undefined }) {
    if (Array.isArray(value)) return <p>{value.length ? value.join(', ') : 'No answer'}</p>;
    if (!value) return <p className="text-slate-500">No answer</p>;
    return <>{value.split('<br>').map((line, i) => <p key={i}>{line || ' '}</p>)}</>
}

export default async function SubmissionDetailsPage({ params }: { params: Promise<{ id: string, submissionId: string }> }) {
    const { id, submissionId } = await params;
    const userId = await getCurrentUserId();
    const members = await getTroupeMembers(id);
    const canManage = userId && members.some((member) => member.id === userId && member.confirmed && member.role !== 'coach');
    if (!canManage) notFound();

    const form = await getSubmissionForm('troupe', id);
    const submission = await getSubmissionById(submissionId);
    if (!form || !submission || submission.formId !== form.id) notFound();

    const submitter = submission.userId ? await getUserAbbreviated(submission.userId) : null;

    return (
        <section className="medium-section">
            <Link className="link text-sm" href={`/troupes/${id}/submissions`}>Back to submissions</Link>
            <h1 className="text-xl mt-2">{submitter?.name || submission.contactEmail || 'Unknown submitter'}</h1>
            {submission.contactEmail && !submission.userId && (
                <p className="text-sm text-slate-600 dark:text-slate-300">{submission.contactEmail}</p>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Submitted {formatDateTimeForDisplay(submission.submittedAt, true)}
            </p>
            <div className="flex flex-col gap-4">
                {form.questions.map((question) => (
                    <div key={question.id}>
                        <h2 className="font-semibold text-slate-700 dark:text-slate-300">{question.label}</h2>
                        <Answer value={submission.answers[question.id]} />
                    </div>
                ))}
                {form.hasAudition && !form.auditionDatesTbd && (
                    <div>
                        <h2 className="font-semibold text-slate-700 dark:text-slate-300">Audition Availability</h2>
                        {form.auditionSlots
                            .filter((slot) => submission.auditionAvailability.includes(slot.id))
                            .map((slot) => <p key={slot.id}>{formatDateTimeForDisplay(slot.dateTime, true)}</p>)}
                        {!submission.auditionAvailability.length && <p className="text-slate-500">No available audition dates selected.</p>}
                    </div>
                )}
            </div>
        </section>
    )
}
