import { SubmissionForm, SubmissionFormSubmission } from "@/types";

export function assignSubmissionsToAuditionSlots(form: SubmissionForm, submissions: SubmissionFormSubmission[]) {
    const slots = form.auditionSlots.map((slot) => ({ slot, submissions: [] as SubmissionFormSubmission[] }));
    const unassigned: SubmissionFormSubmission[] = [];
    if (!slots.length) return { slots, unassigned: submissions };

    const ordered = [...submissions].sort((a, b) => a.auditionAvailability.length - b.auditionAvailability.length);
    ordered.forEach((submission) => {
        const possibleSlots = slots
            .filter(({ slot }) => submission.auditionAvailability.includes(slot.id))
            .sort((a, b) => a.submissions.length - b.submissions.length);
        if (possibleSlots.length) {
            possibleSlots[0].submissions.push(submission);
        } else {
            unassigned.push(submission);
        }
    });
    return { slots, unassigned };
}
