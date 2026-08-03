'use client';

import Button from "@/components/form/button";
import { saveTroupeAuditionSlotAssignments } from "@/actions/submission-actions";
import { AuditionSlot } from "@/types";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

interface AuditionSubmission {
    id: string;
    name: string;
    href: string;
    auditionAvailability: string[];
    assignedAuditionSlotId: string | null;
}

function shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function serializeAssignments(assignments: Record<string, string | null>): string {
    return Object.entries(assignments)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([submissionId, slotId]) => `${submissionId}:${slotId || ''}`)
        .join('|');
}

export default function AuditionSlotsClient({
    troupeId,
    formId,
    slots,
    submissions
}: {
    troupeId: string;
    formId: string;
    slots: AuditionSlot[];
    submissions: AuditionSubmission[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const slotIds = useMemo(() => new Set(slots.map((slot) => slot.id)), [slots]);
    const [savedAssignments, setSavedAssignments] = useState<Record<string, string | null>>(() => (
        Object.fromEntries(submissions.map((submission) => [
            submission.id,
            submission.assignedAuditionSlotId
                && slotIds.has(submission.assignedAuditionSlotId)
                && submission.auditionAvailability.includes(submission.assignedAuditionSlotId)
                ? submission.assignedAuditionSlotId
                : null
        ]))
    ));
    const [assignments, setAssignments] = useState<Record<string, string | null>>(savedAssignments);
    const [expandedSubmissionIds, setExpandedSubmissionIds] = useState<Set<string>>(new Set());
    const [message, setMessage] = useState<string | null>(null);

    const slotLabels = useMemo(() => Object.fromEntries(
        slots.map((slot) => [slot.id, formatDateTimeForDisplay(slot.dateTime, true)])
    ), [slots]);
    const dirty = serializeAssignments(assignments) !== serializeAssignments(savedAssignments);
    const grouped = useMemo(() => {
        const groups = Object.fromEntries(slots.map((slot) => [slot.id, [] as AuditionSubmission[]]));
        const unassigned: AuditionSubmission[] = [];
        submissions.forEach((submission) => {
            const slotId = assignments[submission.id];
            if (slotId && groups[slotId]) {
                groups[slotId].push(submission);
            } else {
                unassigned.push(submission);
            }
        });
        return { groups, unassigned };
    }, [assignments, slots, submissions]);

    const setAssignment = (submissionId: string, slotId: string | null) => {
        setMessage(null);
        setAssignments((current) => ({ ...current, [submissionId]: slotId }));
        setExpandedSubmissionIds((current) => {
            const next = new Set(current);
            next.delete(submissionId);
            return next;
        });
    };

    const toggleExpanded = (submissionId: string) => {
        setExpandedSubmissionIds((current) => {
            const next = new Set(current);
            if (next.has(submissionId)) {
                next.delete(submissionId);
            } else {
                next.add(submissionId);
            }
            return next;
        });
    };

    const autoAssign = () => {
        setMessage(null);
        setAssignments((current) => {
            const next = { ...current };
            const counts = Object.fromEntries(slots.map((slot) => [slot.id, 0]));
            submissions.forEach((submission) => {
                const slotId = next[submission.id];
                if (slotId && counts[slotId] !== undefined) counts[slotId] += 1;
            });

            shuffle(submissions.filter((submission) => !next[submission.id]))
                .sort((a, b) => a.auditionAvailability.length - b.auditionAvailability.length)
                .forEach((submission) => {
                    const possibleSlots = shuffle(slots.filter((slot) => submission.auditionAvailability.includes(slot.id)))
                        .sort((a, b) => counts[a.id] - counts[b.id]);
                    if (!possibleSlots.length) return;
                    const slotId = possibleSlots[0].id;
                    next[submission.id] = slotId;
                    counts[slotId] += 1;
                });

            return next;
        });
    };

    const cancelChanges = () => {
        setAssignments(savedAssignments);
        setMessage(null);
    };

    const saveChanges = () => {
        setMessage(null);
        startTransition(async () => {
            try {
                const payload = submissions.map((submission) => ({
                    submissionId: submission.id,
                    slotId: assignments[submission.id] || null
                }));
                await saveTroupeAuditionSlotAssignments(troupeId, formId, payload);
                const nextSaved = Object.fromEntries(payload.map((assignment) => [assignment.submissionId, assignment.slotId]));
                setSavedAssignments(nextSaved);
                setAssignments(nextSaved);
                setMessage('Audition slots saved.');
                router.refresh();
            } catch (error) {
                setMessage(error instanceof Error ? error.message : 'Could not save audition slots.');
            }
        });
    };

    const renderSubmitter = (submission: AuditionSubmission) => {
        const assignedSlotId = assignments[submission.id];
        const availableSlots = slots.filter((slot) => submission.auditionAvailability.includes(slot.id));
        const isExpanded = expandedSubmissionIds.has(submission.id);
        return (
            <div key={submission.id} className="py-2 border-t border-gray-200 first:border-t-0">
                <div className="flex flex-col">
                    <div className="flex flex-row items-center gap-2">
                        <button
                            type="button"
                            className="w-5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                            onClick={() => toggleExpanded(submission.id)}
                            aria-label={`${isExpanded ? 'Hide' : 'Show'} slot options for ${submission.name}`}
                            aria-expanded={isExpanded}
                            disabled={isPending}
                        >
                            <FontAwesomeIcon icon={isExpanded ? faCaretDown : faCaretRight} />
                        </button>
                        {submission.name}
                    </div>
                    {isExpanded && (
                        <div className="flex flex-col gap-2 pl-7">
                            <select
                                className="w-full"
                                value={assignedSlotId || ''}
                                onChange={(event) => setAssignment(submission.id, event.target.value || null)}
                                disabled={isPending}
                                aria-label={`Audition slot for ${submission.name}`}
                            >
                                <option value="">Unassigned</option>
                                {availableSlots.map((slot) => (
                                    <option key={slot.id} value={slot.id}>
                                        {slotLabels[slot.id]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row flex-wrap gap-2">
                <Button className="px-3 py-1" caption="Auto Assign" onClick={autoAssign} disabled={isPending || submissions.every((submission) => assignments[submission.id])} />
                <Button className="px-3 py-1" caption={isPending ? "Saving..." : "Save"} onClick={saveChanges} disabled={isPending || !dirty} />
                <Button className="px-3 py-1" caption="Cancel" onClick={cancelChanges} disabled={isPending || !dirty} />
            </div>
            {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slots.map((slot) => (
                    <div key={slot.id} className="rounded border border-gray-300 p-3">
                        <div className="flex flex-row justify-between gap-2">
                            <h2 className="font-semibold text-slate-700 dark:text-slate-300">
                                {slotLabels[slot.id]}
                            </h2>
                            <span className="text-sm text-slate-500">{grouped.groups[slot.id].length}</span>
                        </div>
                        {grouped.groups[slot.id].length
                            ? grouped.groups[slot.id].map(renderSubmitter)
                            : <p className="text-sm text-slate-500">No one assigned.</p>}
                    </div>
                ))}
            </div>
            <div className="mt-2">
                <h2 className="font-semibold text-slate-700 dark:text-slate-300">Unassigned</h2>
                {grouped.unassigned.length
                    ? grouped.unassigned.map(renderSubmitter)
                    : <p className="text-sm text-slate-500">Everyone has an audition slot.</p>}
            </div>
        </div>
    );
}
