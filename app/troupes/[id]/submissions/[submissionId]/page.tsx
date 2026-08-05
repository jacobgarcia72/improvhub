import { getSubmissionById, getSubmissionForm } from "@/lib/submission-forms";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId, getUserAbbreviated } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { optimizeImage } from "@/lib/optimize-image";

function Answer({ value, isEmail }: { value: string | string[] | undefined, isEmail?: boolean }) {
    if (Array.isArray(value)) return <p className={value.length ? '' : 'text-slate-500'}>{value.length ? value.join(', ') : 'No answer'}</p>;
    if (!value) return <p className="text-slate-500">No answer</p>;
    if (isEmail) return <p><a className="link" href={`mailto:${value}`}>{value || ' '}</a></p>
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
    const troupe = await getTroupe(id);

    const submitterNameElement = <h1 className="text-xl mt-2">{submitter?.name || submission.answers.name || submission.contactEmail || 'Unknown submitter'}</h1>
    return (
        <section className="px-10! sm:px-16!">
            <Link className="link text-sm" href={`/troupes/${id}/submissions`}>Back to submissions</Link>
            <div className="flex flex-row">
                {submitter?.image ? (
                    <Link href={`/profile/${submitter.id}`}>
                        <Image
                            src={optimizeImage(submitter.image, 100, 100, 100, true, false)}
                            alt={submitter.name || 'Submitter profile image'}
                            width={100}
                            height={100}
                            className="rounded mr-3 mt-2 mb-3 hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                ) : null}
                <div className="flex flex-col">
                    {submission.userId ? (
                        <Link className="link" href={`/profile/${submission.userId}`}>
                            {submitterNameElement}
                        </Link>
                    ) : (
                        <>
                            {submitterNameElement}
                            {submission.contactEmail ? (
                                <a href={`mailto:${submission.contactEmail}`} className="link text-sm mt-[-2px] mb-1">{submission.contactEmail}</a>
                            ) : null}
                        </>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                        Submitted {formatDateTimeForDisplay(submission.submittedAt, true)}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-4">
                {form.questions.map((question) => {
                    if (question.builtIn === 'name') return null;
                    const questionText = question.label
                        .replace('{name}', troupe?.name || 'this troupe')
                        .replace('{type}', 'troupe')
                        .replace('{verb}', 'joining');
                    return (
                        <div key={question.id}>
                            <h2 className="font-semibold text-slate-700 dark:text-slate-300">{questionText}</h2>
                            <Answer isEmail={question.id === 'email'} value={submission.answers[question.id]} />
                        </div>
                )})}
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
            <Link className="link text-sm" href={`/troupes/${id}/submissions`}>Back to submissions</Link>
        </section>
    )
}
