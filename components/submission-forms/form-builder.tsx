'use client';

import { useLayoutEffect, useRef, useState, type DragEvent } from "react";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import InputList from "@/components/form/input-list";
import Text from "@/components/form/text";
import Checkbox from "@/components/form/checkbox";
import XButton from "@/components/form/x";
import { builtInSubmissionQuestions } from "@/lib/submission-question-options";
import { SubmissionForm, SubmissionFormQuestion } from "@/types";
import { appName } from "@/lib/app-info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faGripVertical } from "@fortawesome/free-solid-svg-icons";

type CustomQuestion = {
    label: string;
    type: SubmissionFormQuestion['type'];
    required: boolean;
    options: string;
};

type AuditionSlotInput = {
    key: number;
    date: string;
    time: string;
};

type QuestionOrderItem =
    | { kind: 'builtIn'; id: string }
    | { kind: 'custom'; index: number };

function parseOptionInputs(options: string): string[] {
    return options.split(/\r?\n|,/).map((option) => option.trim()).filter(Boolean);
}

function sortAnythingElseLast(questions: QuestionOrderItem[]): QuestionOrderItem[] {
    return [
        ...questions.filter((question) => !(question.kind === 'builtIn' && question.id === 'anything_else')),
        ...questions.filter((question) => question.kind === 'builtIn' && question.id === 'anything_else'),
    ];
}

function getInitialQuestionOrder(existingForm?: SubmissionForm | null): QuestionOrderItem[] {
    if (!existingForm?.questions.length) {
        return sortAnythingElseLast([
            ...builtInSubmissionQuestions.map((question) => ({ kind: 'builtIn' as const, id: question.id })),
            { kind: 'custom', index: 0 },
        ]);
    }

    let customIndex = 0;
    const orderedQuestions = existingForm.questions.map((question) => {
        if (question.builtIn) return { kind: 'builtIn' as const, id: question.id };
        return { kind: 'custom' as const, index: customIndex++ };
    });
    const orderedBuiltInIds = new Set(orderedQuestions.filter((question) => question.kind === 'builtIn').map((question) => question.id));
    const unselectedBuiltIns = builtInSubmissionQuestions
        .filter((question) => !orderedBuiltInIds.has(question.id))
        .map((question) => ({ kind: 'builtIn' as const, id: question.id }));

    return [...orderedQuestions, ...sortAnythingElseLast(unselectedBuiltIns)];
}

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
    const [hasCloseDate, setHasCloseDate] = useState(Boolean(existingForm?.closesAt));
    const [selectedBuiltInIds, setSelectedBuiltInIds] = useState(builtIns.map((question) => question.id));
    const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);
    const orderRowRefs = useRef(new Map<string, HTMLDivElement>());
    const pendingAnimationPositions = useRef<Map<string, DOMRect> | null>(null);
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
    const [questionOrder, setQuestionOrder] = useState<QuestionOrderItem[]>(getInitialQuestionOrder(existingForm));
    const nextAuditionSlotKey = useRef(existingForm?.auditionSlots.length || 1);
    const [auditionSlots, setAuditionSlots] = useState<AuditionSlotInput[]>(
        existingForm?.auditionSlots.length
            ? existingForm.auditionSlots.map((slot, index) => {
                const [date, time] = slot.dateTime.split(' ');
                return { key: index, date, time };
            })
            : [{ key: 0, date: '', time: '' }]
    );

    useLayoutEffect(() => {
        const previousPositions = pendingAnimationPositions.current;
        if (!previousPositions) return;

        pendingAnimationPositions.current = null;
        orderRowRefs.current.forEach((row, questionValue) => {
            const previousPosition = previousPositions.get(questionValue);
            if (!previousPosition) return;

            const currentPosition = row.getBoundingClientRect();
            const deltaY = previousPosition.top - currentPosition.top;
            if (!deltaY) return;

            row.animate(
                [
                    { transform: `translateY(${deltaY}px)` },
                    { transform: 'translateY(0)' },
                ],
                {
                    duration: 300,
                    easing: 'cubic-bezier(0.2, 0, 0.2, 1)',
                }
            );
        });
    }, [questionOrder]);

    const captureOrderRowPositions = () => {
        const positions = new Map<string, DOMRect>();
        orderRowRefs.current.forEach((row, questionValue) => {
            positions.set(questionValue, row.getBoundingClientRect());
        });
        return positions;
    };
    const setQuestionOrderWithAnimation = (nextOrder: QuestionOrderItem[]) => {
        pendingAnimationPositions.current = captureOrderRowPositions();
        setQuestionOrder(nextOrder);
    };
    const addCustomQuestion = () => {
        const nextIndex = customQuestions.length;
        const nextQuestionOrder = [...questionOrder];
        const anythingElseIndex = nextQuestionOrder.findIndex((orderItem) => orderItem.kind === 'builtIn' && orderItem.id === 'anything_else');
        const insertionIndex = anythingElseIndex >= 0 ? anythingElseIndex : nextQuestionOrder.length;

        setCustomQuestions([...customQuestions, { label: '', type: 'long_text', required: false, options: '' }]);
        nextQuestionOrder.splice(insertionIndex, 0, { kind: 'custom', index: nextIndex });
        setQuestionOrderWithAnimation(nextQuestionOrder);
    };
    const addAuditionSlot = () => {
        setAuditionSlots([...auditionSlots, { key: nextAuditionSlotKey.current, date: '', time: '' }]);
        nextAuditionSlotKey.current++;
    };
    const removeAuditionSlot = (slotKey: number) => {
        if (auditionSlots.length <= 1) return;
        setAuditionSlots(auditionSlots.filter((slot) => slot.key !== slotKey));
    };
    const toggleBuiltInQuestion = (id: string, checked: boolean) => {
        setSelectedBuiltInIds(checked ? [...selectedBuiltInIds, id] : selectedBuiltInIds.filter((selectedId) => selectedId !== id));
    };
    const moveQuestion = (activeIndex: number, direction: -1 | 1) => {
        const activeQuestions = getActiveOrderedQuestions();
        const nextActiveIndex = activeIndex + direction;
        if (nextActiveIndex < 0 || nextActiveIndex >= activeQuestions.length) return;

        const currentQuestion = activeQuestions[activeIndex];
        const nextQuestion = activeQuestions[nextActiveIndex];
        const currentOrderIndex = questionOrder.indexOf(currentQuestion);
        const nextOrderIndex = questionOrder.indexOf(nextQuestion);
        const nextOrder = [...questionOrder];
        [nextOrder[currentOrderIndex], nextOrder[nextOrderIndex]] = [nextOrder[nextOrderIndex], nextOrder[currentOrderIndex]];
        setQuestionOrderWithAnimation(nextOrder);
    };
    const moveQuestionTo = (draggedQuestionValue: string, targetActiveIndex: number) => {
        const activeQuestions = getActiveOrderedQuestions();
        const draggedActiveIndex = activeQuestions.findIndex((orderItem) => getQuestionOrderValue(orderItem) === draggedQuestionValue);
        if (draggedActiveIndex < 0) return;

        const currentOrderIndex = questionOrder.findIndex((orderItem) => getQuestionOrderValue(orderItem) === draggedQuestionValue);
        if (currentOrderIndex < 0) return;

        const adjustedTargetActiveIndex = draggedActiveIndex < targetActiveIndex ? targetActiveIndex - 1 : targetActiveIndex;
        const activeQuestionsAfterRemoval = activeQuestions.filter((orderItem) => getQuestionOrderValue(orderItem) !== draggedQuestionValue);
        const targetQuestion = activeQuestionsAfterRemoval[adjustedTargetActiveIndex];
        const nextOrder = [...questionOrder];
        const [movedQuestion] = nextOrder.splice(currentOrderIndex, 1);

        if (targetQuestion) {
            const targetOrderIndex = nextOrder.findIndex((orderItem) => getQuestionOrderValue(orderItem) === getQuestionOrderValue(targetQuestion));
            nextOrder.splice(targetOrderIndex, 0, movedQuestion);
        } else if (activeQuestionsAfterRemoval.length) {
            const lastActiveQuestion = activeQuestionsAfterRemoval[activeQuestionsAfterRemoval.length - 1];
            const lastActiveOrderIndex = nextOrder.findIndex((orderItem) => getQuestionOrderValue(orderItem) === getQuestionOrderValue(lastActiveQuestion));
            nextOrder.splice(lastActiveOrderIndex + 1, 0, movedQuestion);
        } else {
            nextOrder.push(movedQuestion);
        }

        setQuestionOrderWithAnimation(nextOrder);
    };
    const handleDragStart = (event: DragEvent<HTMLDivElement>, questionValue: string) => {
        setDraggedQuestion(questionValue);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', questionValue);
    };
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        const rows = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[data-question-order-row]'));
        const nextDropIndex = rows.findIndex((row) => {
            const rowRect = row.getBoundingClientRect();
            return event.clientY < rowRect.top + rowRect.height / 2;
        });
        setDropIndex(nextDropIndex === -1 ? rows.length : nextDropIndex);
    };
    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        moveQuestionTo(event.dataTransfer.getData('text/plain') || draggedQuestion || '', dropIndex ?? activeOrderedQuestions.length);
        setDraggedQuestion(null);
        setDropIndex(null);
    };
    const handleDragEnd = () => {
        setDraggedQuestion(null);
        setDropIndex(null);
    };
    const getActiveOrderedQuestions = () => questionOrder.filter((orderItem) => {
        if (orderItem.kind === 'builtIn') return selectedBuiltInIds.includes(orderItem.id);
        return Boolean(customQuestions[orderItem.index]);
    });
    const activeOrderedQuestions = getActiveOrderedQuestions();
    const getQuestionOrderValue = (orderItem: QuestionOrderItem) => (
        orderItem.kind === 'builtIn' ? `builtIn:${orderItem.id}` : `custom:${orderItem.index}`
    );
    const getQuestionOrderLabel = (orderItem: QuestionOrderItem) => {
        if (orderItem.kind === 'custom') return customQuestions[orderItem.index]?.label || `Custom Question ${orderItem.index + 1}`;
        const question = builtInSubmissionQuestions.find((builtInQuestion) => builtInQuestion.id === orderItem.id);
        return question?.label
            .replace('{name}', ownerName)
            .replace('{type}', type)
            .replace('{verb}', type === 'troupe' ? 'joining' : 'submitting for') || orderItem.id;
    };

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
                            <div key={slot.key} className="flex flex-row items-end gap-2">
                                <div className="grid grow grid-cols-1 sm:grid-cols-2 gap-2">
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
                                {auditionSlots.length > 1 && (
                                    <div className="pb-1">
                                        <XButton onClick={() => removeAuditionSlot(slot.key)} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {!datesTbd && auditionSlots.length < 8 && (
                            <button type="button" className="link w-fit px-2 py-1" onClick={addAuditionSlot}>Add Audition Date</button>
                        )}
                    </>
                )}
            </div>

            <Text name="description" label="Form introduction" rows={6} value={existingForm?.description?.replaceAll('<br>', '\n') || ''} />

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
                            <Checkbox
                                name={`question-${question.id}`}
                                label={questionText}
                                defaultChecked={Boolean(selected)}
                                onChange={(checked) => toggleBuiltInQuestion(question.id, checked)}
                            />
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
                            <InputList
                                name={`custom-question-options-${i}`}
                                label="Options"
                                addLabel="Option"
                                startingOptions={parseOptionInputs(question.options)}
                            />
                        )}
                    </div>
                ))}
                {customQuestions.length < 8 && (
                    <button type="button" className="link w-fit px-2 py-1" onClick={addCustomQuestion}>Add Custom Question</button>
                )}
            </div>

            <div className="flex flex-col gap-2 rounded border border-gray-300 p-3">
                <h2 className="font-semibold text-slate-700 dark:text-slate-300">Question Order</h2>
                <div onDragOver={handleDragOver} onDrop={handleDrop}>
                    {activeOrderedQuestions.map((orderItem, activeIndex) => {
                        const questionValue = getQuestionOrderValue(orderItem);
                        const isDragging = draggedQuestion === questionValue;
                        return (
                        <div key={questionValue}>
                            <div className="h-2">
                                {dropIndex === activeIndex && <div className="h-0.5 translate-y-[3px] bg-blue-500 dark:bg-mist-300" />}
                            </div>
                            <div
                                data-question-order-row
                                ref={(row) => {
                                    if (row) {
                                        orderRowRefs.current.set(questionValue, row);
                                    } else {
                                        orderRowRefs.current.delete(questionValue);
                                    }
                                }}
                                className={`flex flex-row items-center gap-2 pr-2 ${isDragging ? 'opacity-50' : ''}`}
                                draggable
                                onDragStart={(event) => handleDragStart(event, questionValue)}
                                onDragEnd={handleDragEnd}
                            >
                                <input type="hidden" name="question-order" value={questionValue} />
                                <span className="cursor-move select-none text-sm text-slate-500 dark:text-slate-400" aria-hidden="true">
                                    <FontAwesomeIcon icon={faGripVertical} />
                                </span>
                                <span className="grow text-sm text-slate-700 dark:text-slate-300">{getQuestionOrderLabel(orderItem)}</span>
                                <button
                                    type="button"
                                    className="p-0! w-fit disabled:text-gray-400 text-slate-600 dark:text-mist-400 hover:text-blue-500 hover:dark:text-white"
                                    onClick={() => moveQuestion(activeIndex, -1)}
                                    disabled={activeIndex === 0}
                                >
                                    <FontAwesomeIcon icon={faCaretUp} />
                                </button>
                                <button
                                    type="button"
                                    className="p-0! w-fit disabled:text-gray-400 text-slate-600 dark:text-mist-400 hover:text-blue-500 hover:dark:text-white"
                                    onClick={() => moveQuestion(activeIndex, 1)}
                                    disabled={activeIndex === activeOrderedQuestions.length - 1}
                                >
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </button>
                            </div>
                        </div>
                        )
                    })}
                    <div className="h-2">
                        {dropIndex === activeOrderedQuestions.length && <div className="h-0.5 translate-y-[3px] bg-blue-500 dark:bg-mist-300" />}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 rounded border border-gray-300 p-3">
                <Checkbox
                    name="hasCloseDate"
                    label={"Close form at specified date and time" + (hasCloseDate ? ':' : '')}
                    defaultChecked={hasCloseDate}
                    onChange={setHasCloseDate}
                />
                {hasCloseDate && (
                    <Input
                        name="closesAt"
                        type="datetime-local"
                        value={existingForm?.closesAt?.replace(' ', 'T') || ''}
                        required
                        maxLength={24}
                    />
                )}
            </div>
        </Form>
    );
}
