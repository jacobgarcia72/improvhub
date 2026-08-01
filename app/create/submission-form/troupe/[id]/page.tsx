import { saveTroupeSubmissionForm } from "@/actions/submission-actions";
import SubmissionFormBuilder from "@/components/submission-forms/form-builder";
import { getSubmissionForm } from "@/lib/submission-forms";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";

export default async function SubmissionFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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

    return (
        <section className="medium-section">
            <h1 className="text-xl mb-3">Submission Form</h1>
            <SubmissionFormBuilder
                ownerName={troupe.name}
                existingForm={existingForm}
                onSubmit={saveTroupeSubmissionForm.bind(null, id)}
            />
        </section>
    )
}
