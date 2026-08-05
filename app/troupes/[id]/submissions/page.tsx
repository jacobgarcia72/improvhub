import Button from "@/components/form/button";
import { getSubmissionForm, getSubmissions } from "@/lib/submission-forms";
import { formatDateTimeForDisplay, isDateTimeInPast } from "@/lib/dates";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId, getUser } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { optimizeImage } from "@/lib/optimize-image";
import Initials from "@/components/initials";
import AddToTroupe from "./add-to-troupe";

export default async function TroupeSubmissionsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const troupe = await getTroupe(id);
    if (!troupe) notFound();

    const userId = await getCurrentUserId();
    const members = await getTroupeMembers(id);
    const canManage = userId && members.some((member) => member.id === userId && member.confirmed && member.role !== 'coach');
    if (!canManage) notFound();

    const form = await getSubmissionForm('troupe', id);
    const formIsClosed = isDateTimeInPast(form?.closesAt);
    const submissions = form ? await getSubmissions(form.id) : [];
    const submitters = await Promise.all(submissions.map((submission) => (
        submission.userId ? getUser(submission.userId) : Promise.resolve(null)
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
                    {formIsClosed && (
                        <Link href={`/create/submission-form/troupe/${id}?new=true`}>
                            <Button className="w-36 red" caption="New Form" />
                        </Link>
                    )}
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
                            <div key={submission.id} className="py-3 flex flex-row flex-wrap justify-start items-start gap-2">
                                {submitter?.id ? (
                                    <Link href={`/profile/${submitter.id}`}>
                                        <div className="hover:scale-105 transition-all duration-300">
                                            {submitter?.image ? (
                                                <Image src={optimizeImage(submitter.image, 100, 100, 100, true)} alt={submitter.name || 'Submitter'} width={50} height={50} className="rounded" />
                                            ) : (
                                                <Initials firstName={submitter.firstName} lastName={submitter.lastName} width={50} />
                                            )}
                                        </div>
                                    </Link>
                                ) : null}
                                <div>
                                    {submitter?.name || submission.contactEmail || 'Unknown submitter'}
                                    <p className="text-xs text-slate-600 dark:text-slate-300">
                                        Submitted {formatDateTimeForDisplay(submission.submittedAt, true)}
                                    </p>
                                    {submission.contactEmail && !submission.userId && (
                                        <p className="text-sm text-slate-600 dark:text-slate-300">{submission.contactEmail}</p>
                                    )}
                                    <div className="flex flex-row flex-wrap gap-4 text-sm">
                                        <Link className="link font-semibold" href={`/troupes/${id}/submissions/${submission.id}`}>
                                            View Submission
                                        </Link>
                                        {submitter?.id ? (
                                            <AddToTroupe
                                                userId={submitter.id}
                                                userFirstName={submitter.firstName}
                                                userLastName={submitter.lastName}
                                                currentUserId={userId}
                                                pronouns={submitter.pronouns}
                                                troupeId={id}
                                                troupeName={troupe.name}
                                                isInTroupe={members.some(({ id, role }) => id === submitter.id && role === 'player')}
                                            />
                                        ) : null}
                                        {submission.contactEmail ? (
                                            <a href={`mailto:${submission.contactEmail}`} className="link font-semibold">
                                                Email:&nbsp;{submission.contactEmail}
                                            </a>
                                        ) : null}
                                    </div>
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
