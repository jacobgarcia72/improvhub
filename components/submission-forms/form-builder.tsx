'use client';

import { useState } from "react";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import Text from "@/components/form/text";
import Checkbox from "@/components/form/checkbox";
import { builtInSubmissionQuestions } from "@/lib/submission-question-options";
import { SubmissionForm, SubmissionFormQuestion } from "@/types";
import { appName } from "@/lib/app-info";

type CustomQuestion = {
    label: string;
    type: SubmissionFormQuestion['type'];
    required: boolean;
    options: string;
};

export default function SubmissionFormBuilder({
    existingForm,
    ownerName,
    type,
    onSubmit,
}: {
    existingForm?: SubmissionForm | null;
    ownerName: string;
    type: 'troupe' | 'show';
    onSubmit: (prevState: void | { message?: string }, formData: FormData) => Promise<{ message?: string } | void>;
}) {
    const builtIns = existingForm?.questions.filter((question) => question.builtIn) || [];
    const customExisting = existingForm?.questions.filter((question) => !question.builtIn) || [];
    const [hasAudition, setHasAudition] = useState(Boolean(existingForm?.hasAudition));
    const [datesTbd, setDatesTbd] = useState(Boolean(existingForm?.auditionDatesTbd));
    const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>(
        customExisting.length
            ? customExisting.map((question) => ({
                label: question.label,
                type: question.type,
                required: Boolean(question.required),
                options: question.options?.join('\n') || ''
            }))
            : [{ label: '', type: 'long_text', required: false, options: '' }]
    );
    const [auditionSlots, setAuditionSlots] = useState(
        existingForm?.auditionSlots.length
            ? existingForm.auditionSlots.map((slot) => {
                const [date, time] = slot.dateTime.split(' ');
                return { date, time };
            })
            : [{ date: '', time: '' }]
    );

    const addCustomQuestion = () => setCustomQuestions([...customQuestions, { label: '', type: 'long_text', required: false, options: '' }]);
    const addAuditionSlot = () => setAuditionSlots([...auditionSlots, { date: '', time: '' }]);

    return (
        <Form onSubmit={onSubmit} buttonCaption="Save Form" className="w-full max-w-xl">
            <Input name="title" label="Form Title" value={existingForm?.title || `${ownerName} Submission Form`} required maxLength={120} />

            <div className="rounded border border-gray-300 p-3">
                <Checkbox
                    name="requiresSignIn"
                    label={`Only allow ${appName} users to view and submit this form`}
                    defaultChecked={existingForm?.requiresSignIn || false}
                />
            </div>

            <div className="flex flex-col gap-3 rounded border border-gray-300 p-3">
                <Checkbox name="hasAudition" label="Include Auditions" defaultChecked={hasAudition} onChange={setHasAudition} />
                {hasAudition && (
                    <>
                        <Checkbox name="auditionDatesTbd" label="Audition date(s) TBD" defaultChecked={datesTbd} onChange={setDatesTbd} />
                        {!datesTbd && auditionSlots.map((slot, i) => (
                            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input
                                    name={`audition-date-${i}`}
                                    label={`Audition Date ${i + 1}`}
                                    type="date"
                                    value={slot.date}
                                    onChange={(value) => setAuditionSlots(auditionSlots.map((item, index) => index === i ? { ...item, date: value } : item))}
                                    maxLength={20}
                                />
                                <Input
                                    name={`audition-time-${i}`}
                                    label="Time"
                                    type="time"
                                    value={slot.time}
                                    onChange={(value) => setAuditionSlots(auditionSlots.map((item, index) => index === i ? { ...item, time: value } : item))}
                                    maxLength={20}
                                />
                            </div>
                        ))}
                        {!datesTbd && auditionSlots.length < 8 && (
                            <button type="button" className="link w-fit px-2 py-1" onClick={addAuditionSlot}>Add Audition Date</button>
                        )}
                    </>
                )}
            </div>

            <Text name="description" label="Form introduction" rows={4} value={existingForm?.description?.replaceAll('<br>', '\n') || ''} />

            <div className="flex flex-col gap-2 rounded border border-gray-300 p-3">
                <h2 className="font-semibold text-slate-700 dark:text-slate-300">Questions</h2>
                {builtInSubmissionQuestions.map((question) => {
                    const selected = builtIns.find((existing) => existing.id === question.id);
                    const questionText = question.label
                        .replace('{name}', ownerName)
                        .replace('{type}', type)
                        .replace('{verb}', type === 'troupe' ? 'joining' : 'submitting for');
                    return (
                        <div key={question.id} className="flex flex-row flex-wrap gap-x-4 gap-y-1 items-center">
                            <Checkbox name={`question-${question.id}`} label={questionText} defaultChecked={Boolean(selected)} />
                            {question.requiredOption ? <Checkbox name={`required-${question.id}`} label="Required" defaultChecked={Boolean(selected?.required)} /> : null}
                        </div>
                    )
                })}
            </div>

            <div className="flex flex-col gap-3 rounded border border-gray-300 p-3">
                <h2 className="font-semibold text-slate-700 dark:text-slate-300">Custom Questions</h2>
                {customQuestions.map((question, i) => (
                    <div key={i} className="flex flex-col gap-2 border-t border-gray-200 pt-3 first:border-t-0 first:pt-0">
                        <Input
                            name={`custom-question-${i}`}
                            label={`Question ${i + 1}`}
                            value={question.label}
                            onChange={(value) => setCustomQuestions(customQuestions.map((item, index) => index === i ? { ...item, label: value } : item))}
                            maxLength={160}
                        />
                        <div className="flex flex-row flex-wrap gap-3 items-end">
                            <div className="flex flex-col">
                                <label htmlFor={`custom-question-type-${i}`}>Answer Type</label>
                                <select
                                    id={`custom-question-type-${i}`}
                                    name={`custom-question-type-${i}`}
                                    value={question.type}
                                    onChange={(event) => setCustomQuestions(customQuestions.map((item, index) => index === i ? { ...item, type: event.target.value as SubmissionFormQuestion['type'] } : item))}
                                >
                                    <option value="short_text">Short answer</option>
                                    <option value="long_text">Long answer</option>
                                    <option value="single_select">Select one</option>
                                    <option value="multi_select">Select multiple</option>
                                </select>
                            </div>
                            <div className="pb-1">
                                <Checkbox
                                    name={`custom-question-required-${i}`}
                                    label="Required"
                                    defaultChecked={question.required}
                                    onChange={(checked) => setCustomQuestions(customQuestions.map((item, index) => index === i ? { ...item, required: checked } : item))}
                                />
                            </div>
                        </div>
                        {['single_select', 'multi_select'].includes(question.type) && (
                            <Text name={`custom-question-options-${i}`} label="Options" rows={3} value={question.options} />
                        )}
                    </div>
                ))}
                {customQuestions.length < 8 && (
                    <button type="button" className="link w-fit px-2 py-1" onClick={addCustomQuestion}>Add Custom Question</button>
                )}
            </div>
        </Form>
    );
}
