import Form from "@/components/form/form";
import Input from "@/components/form/input";
import Text from "@/components/form/text";
import Checkbox from "@/components/form/checkbox";
import { Demographics, SubmissionForm, SubmissionFormSubmission, User } from "@/types";
import { formatDateTimeForDisplay } from "@/lib/dates";

function getDefaultAnswer(questionId: string, user: User, demographics: Demographics | null, existingSubmission?: SubmissionFormSubmission | null): string {
    const existing = existingSubmission?.answers[questionId];
    if (Array.isArray(existing)) return existing.join(', ');
    if (existing) return existing;
    if (questionId === 'pronouns') return user.pronouns || '';
    if (questionId === 'gender_identity') return demographics?.genderIdentity || '';
    if (questionId === 'orientation') return demographics?.orientation || '';
    if (questionId === 'ethnicity') return demographics?.ethnicity || '';
    return '';
}

export default function SubmissionFormView({
    form,
    user,
    ownerName,
    demographics,
    existingSubmission,
    onSubmit,
}: {
    form: SubmissionForm;
    user: User | null;
    ownerName: string | null;
    demographics: Demographics | null;
    existingSubmission?: SubmissionFormSubmission | null;
    onSubmit: (prevState: void | { message?: string }, formData: FormData) => Promise<{ message?: string } | void>;
}) {
    return (
        <Form onSubmit={onSubmit} buttonCaption={existingSubmission ? "Update Submission" : "Submit"} className="w-full max-w-xl">
            {!user && <Input
                name="contactEmail"
                label="Email Address *"
                type="email"
                value={existingSubmission?.contactEmail || ''}
                required
                maxLength={180}
            />}
            {form.questions.map((question) => {
                const name = `answer-${question.id}`;
                let label = question.label
                    .replace('{name}', ownerName || `this ${form.ownerType}`)
                    .replace('{type}', form.ownerType)
                    .replace('{verb}', form.ownerType === 'troupe' ? 'joining' : 'submitting for');
                if (label[label.length - 1].match(/[a-zA-Z0-9]/)) label += ':';
                if (question.required) label += ' *';
                const value = user ? getDefaultAnswer(question.id, user, demographics, existingSubmission) : '';
                if (question.type === 'long_text') {
                    return <Text key={question.id} name={name} label={label} rows={4} value={value.replaceAll('<br>', '\n')} />
                }
                if (question.type === 'single_select') {
                    return (
                        <div key={question.id} className="flex flex-col">
                            <label htmlFor={name}>{label}</label>
                            <select name={name} id={name} defaultValue={value} required={question.required}>
                                <option value="">Choose one</option>
                                {(question.options || []).map((option) => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </div>
                    )
                }
                if (question.type === 'multi_select') {
                    const existingAnswers = existingSubmission?.answers[question.id];
                    const values = Array.isArray(existingAnswers) ? existingAnswers : [];
                    return (
                        <div key={question.id} className="flex flex-col gap-1">
                            <p className="label">{label}</p>
                            {(question.options || []).map((option) => (
                                <Checkbox key={option} name={name} label={option} value={option} defaultChecked={values.includes(option)} />
                            ))}
                        </div>
                    )
                }
                return <Input key={question.id} name={name} label={label} value={value} required={question.required} maxLength={180} />
            })}
            {form.hasAudition && (
                <div className="flex flex-col gap-2 rounded border border-gray-300 p-3">
                    <h2 className="font-semibold text-slate-700 dark:text-slate-300">Audition Availability</h2>
                    {form.auditionDatesTbd ? (
                        <p className="text-sm text-slate-600 dark:text-slate-300">Audition date(s) are TBD.</p>
                    ) : form.auditionSlots.map((slot) => (
                        <Checkbox
                            key={slot.id}
                            name="auditionAvailability"
                            value={slot.id}
                            label={formatDateTimeForDisplay(slot.dateTime, true)}
                            defaultChecked={existingSubmission?.auditionAvailability.includes(slot.id)}
                        />
                    ))}
                </div>
            )}
        </Form>
    )
}
