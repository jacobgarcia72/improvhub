import Form from "@/components/form/form";
import Input from "@/components/form/input";
import Text from "@/components/form/text";
import Checkbox from "@/components/form/checkbox";
import { Demographics, SubmissionForm, SubmissionFormSubmission, User } from "@/types";
import { formatDateTimeForDisplay } from "@/lib/dates";
import Autocomplete from "../form/autocomplete";
import { autocompleteOptions } from "@/lib/submission-question-options";
import { getEmail } from "@/lib/auth";

function getDefaultAnswer(questionId: string, user: User, demographics: Demographics | null, existingSubmission?: SubmissionFormSubmission | null): string {
    const existing = existingSubmission?.answers[questionId];
    if (Array.isArray(existing)) return existing.join(', ');
    if (existing) return existing;
    if (questionId === 'pronouns') return user.pronouns || '';
    if (questionId === 'name') return user.name || (user.firstName && user.lastName && `${user.firstName} ${user.lastName}`) || '';
    if (questionId === 'gender_identity') return demographics?.genderIdentity || '';
    if (questionId === 'orientation') return demographics?.orientation || '';
    if (questionId === 'ethnicity') return demographics?.ethnicity || '';
    return '';
}

export default async function SubmissionFormView({
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
    const email = user ? await getEmail() : '';
    const formQuestions = [...form.questions];
    if (!user) {
        // non-signed-in users MUST provide an email address
        const emailQuestion = formQuestions.find(q => q.id === 'email');
        if (emailQuestion) {
            emailQuestion.required = true;
        } else {
            formQuestions.unshift(
                { id: 'email', label: 'Email address', type: 'short_text', builtIn: 'email', required: true }
            )
        }
    }
    return (
        <Form onSubmit={onSubmit} buttonCaption={existingSubmission ? "Update Submission" : "Submit"} className="w-full max-w-xl">
            {formQuestions.map((question) => {
                const name = `answer-${question.id}`;
                let label = question.label
                    .replace('{name}', ownerName || `this ${form.ownerType}`)
                    .replace('{type}', form.ownerType)
                    .replace('{verb}', form.ownerType === 'troupe' ? 'joining' : 'submitting for');
                if (label[label.length - 1].match(/[a-zA-Z0-9]/)) label += ':';
                let value = '';
                if (user) {
                    if (question.id === 'email') {
                        value = email;
                    } else {
                        value = getDefaultAnswer(question.id, user, demographics, existingSubmission);
                    }
                }
                if (question.type === 'autocomplete') {
                    return <Autocomplete options={autocompleteOptions[question.id] || []} key={question.id} name={name} label={label} startingValue={value} required={question.required} />
                }
                if (question.type === 'long_text') {
                    return <Text key={question.id} name={name} label={label} rows={4} value={value.replaceAll('<br>', '\n')} />
                }
                if (question.type === 'single_select') {
                    return (
                        <div key={question.id} className="flex flex-col">
                            <label htmlFor={name}>{label}</label>
                            <select name={name} id={name} defaultValue={value} required={question.required}>
                                <option value="">Select option...</option>
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
                            {(question.options || []).map((option, optionIndex) => (
                                <Checkbox
                                    key={option}
                                    name={name}
                                    id={`${name}-${optionIndex}`}
                                    label={option}
                                    value={option}
                                    defaultChecked={values.includes(option)}
                                />
                            ))}
                        </div>
                    )
                }
                return <Input readOnly={question.builtIn === 'name' && Boolean(user && value)} key={question.id} name={name} label={label} value={value} required={question.required} maxLength={180} />
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
                            id={`auditionAvailability-${slot.id}`}
                            value={slot.id}
                            label={formatDateTimeForDisplay(slot.dateTime, false, true)}
                            defaultChecked={existingSubmission?.auditionAvailability.includes(slot.id)}
                        />
                    ))}
                </div>
            )}
        </Form>
    )
}
