import { submitSubmissionForm } from "@/actions/submission-actions";
import SubmissionFormView from "@/components/submission-forms/submission-form-view";
import { protectRoute } from "@/lib/auth";
import { formatDateTimeForDisplay, isDateTimeInPast } from "@/lib/dates";
import { getDemographics, getSubmission, getSubmissionForm } from "@/lib/submission-forms";
import { getTroupe } from "@/lib/troupes";
import { getCurrentUser } from "@/lib/users";
import { SubmissionOwnerType } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getOwnerName(ownerType: SubmissionOwnerType, ownerId: string): Promise<string | null> {
    if (ownerType === 'troupe') return (await getTroupe(ownerId))?.name || null;
    return null;
}

export default async function PublicSubmissionFormPage({
    params,
    searchParams,
}: {
    params: Promise<{ ownerType: string, ownerId: string }>;
    searchParams: Promise<{ submitted?: string }>;
}) {
    const { ownerType: rawOwnerType, ownerId } = await params;
    const { submitted } = await searchParams;
    if (!['troupe', 'show'].includes(rawOwnerType)) notFound();
    const ownerType = rawOwnerType as SubmissionOwnerType;
    const form = await getSubmissionForm(ownerType, ownerId);
    if (!form) notFound();

    if (form.requiresSignIn) {
        await protectRoute();
    }

    const user = await getCurrentUser();
    const formIsClosed = isDateTimeInPast(form.closesAt);

    const [ownerName, demographics, existingSubmission] = await Promise.all([
        getOwnerName(ownerType, ownerId),
        user ? getDemographics(user.id) : Promise.resolve(null),
        user ? getSubmission(form.id, user.id) : Promise.resolve(null),
    ]);

    return (
        <section className="medium-section">
            <div className="mb-4">
                <h1 className="text-xl">{form.title}</h1>
                {ownerName && <p className="text-sm text-slate-600 dark:text-slate-300">{ownerName}</p>}
                {form.closesAt && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {formIsClosed ? 'Closed' : 'Closes'} {formatDateTimeForDisplay(form.closesAt, true)}
                    </p>
                )}
                {submitted === 'true' && <p className="mt-2 text-green-700 dark:text-green-300">Submission received.</p>}
                {form.description && (
                    <div className="mt-3 ml-2 text-slate-800 dark:text-slate-200">
                        {form.description.split('<br>').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                )}
            </div>
            {formIsClosed ? (
                <p className="rounded border border-gray-300 p-3 text-slate-700 dark:text-slate-300">
                    This form is closed and is no longer accepting submissions.
                </p>
            ) : (
                <SubmissionFormView
                    form={form}
                    user={user}
                    ownerName={ownerName}
                    demographics={demographics}
                    existingSubmission={existingSubmission}
                    onSubmit={submitSubmissionForm.bind(null, form.id)}
                />
            )}
            {ownerType === 'troupe' && (
                <div className="mt-4">
                    <Link className="link text-sm" href={`/troupes/${ownerId}`}>Back to troupe</Link>
                </div>
            )}
        </section>
    )
}
