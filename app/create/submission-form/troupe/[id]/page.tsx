import { saveTroupeSubmissionForm } from "@/actions/submission-actions";
import SubmissionFormBuilder from "@/components/submission-forms/form-builder";
import { isDateTimeInPast } from "@/lib/dates";
import { getSubmissionForm } from "@/lib/submission-forms";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";

export default async function SubmissionFormPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ new?: string }>;
}) {
    const { id } = await params;
    const { new: newForm } = await searchParams;
    const troupe = await getTroupe(id);
    if (!troupe) notFound();

    const userId = await getCurrentUserId();
    const members = await getTroupeMembers(id);
    const canManage = userId && members.some((member) => (
        member.id === userId &&
        member.confirmed &&
        member.role !== 'coach'
    ));
    if (!canManage) notFound();

    const existingForm = await getSubmissionForm('troupe', id);
    const replaceClosedForm = newForm === 'true' && Boolean(existingForm) && isDateTimeInPast(existingForm?.closesAt);
    const onCancel = async () => {
        'use server'
        redirect(`/troupes/${id}/submissions`);
    };

    return (
        <section className="medium-section">
            <h1 className="text-xl mb-3">Submission Form</h1>
            <SubmissionFormBuilder
                ownerName={troupe.name}
                existingForm={replaceClosedForm ? null : existingForm}
                type="troupe"
                onSubmit={saveTroupeSubmissionForm.bind(null, id, replaceClosedForm)}
                onCancel={onCancel}
            />
        </section>
    )
}
