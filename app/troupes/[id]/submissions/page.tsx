import Button from "@/components/form/button";
import { getSubmissionForm, getSubmissions } from "@/lib/submission-forms";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId, getUserAbbreviated } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TroupeSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const userId = await getCurrentUserId();
    const members = await getTroupeMembers(id);
    const canManage = userId && members.some((member) => member.id === userId && member.confirmed && member.role !== 'coach');
    if (!canManage) notFound();

    const form = await getSubmissionForm('troupe', id);
    const submissions = form ? await getSubmissions(form.id) : [];
    const submitters = await Promise.all(submissions.map((submission) => (
        submission.userId ? getUserAbbreviated(submission.userId) : Promise.resolve(null)
    )));

    return (
        <section className="px-10! sm:px-16!">
            <div className="flex flex-row flex-wrap justify-between gap-2 mb-4">
                <div>
                    <h1 className="text-lg">Submissions</h1>
                    {form && <Link className="link text-sm" href={`/submission-form/troupe/${id}`}>View Submission Form</Link>}
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                    <Link href={`/create/submission-form/troupe/${id}`}>
                        <Button className="w-36" caption={form ? "Edit Form" : "Create Form"} />
                    </Link>
                    {form?.hasAudition && !form.auditionDatesTbd && (
                        <Link href={`/troupes/${id}/submissions/auditions`}>
                            <Button className="w-36" caption="Audition Slots" />
                        </Link>
                    )}
                </div>
            </div>
            {!form ? (
                <p className="text-mist-700 dark:text-mist-400 mb-6">No submission form has been created yet.</p>
            ) : submissions.length === 0 ? (
                <p className="text-mist-700 dark:text-mist-400 mb-6">No submissions yet.</p>
            ) : (
                <div className="flex flex-col divide-y divide-gray-200 mb-6">
                    {submissions.map((submission, i) => {
                        const submitter = submitters[i];
                        return (
                            <div key={submission.id} className="py-3 flex flex-row flex-wrap justify-between gap-2">
                                <div>
                                    <Link className="link font-semibold" href={`/troupes/${id}/submissions/${submission.id}`}>
                                        {submitter?.name || submission.contactEmail || 'Unknown submitter'}
                                    </Link>
                                    {submission.contactEmail && !submission.userId && (
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{submission.contactEmail}</p>
                                    )}
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        Submitted {formatDateTimeForDisplay(submission.submittedAt, true)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
            <Link href={`/troupes/${id}`} className="link">Back</Link>
        </section>
    )
}
