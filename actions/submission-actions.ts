'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentUserId } from "@/lib/users";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import {
    getSubmissionFormById,
    saveAuditionSlotAssignments,
    saveDemographics,
    saveSubmission,
    saveSubmissionForm
} from "@/lib/submission-forms";
import { builtInSubmissionQuestions } from "@/lib/submission-question-options";
import { isDateTimeInPast } from "@/lib/dates";
import { AuditionSlot, Demographics, SubmissionFormQuestion, SubmissionOwnerType } from "@/types";

function cleanLineBreaks(value: string): string {
    return value.trim().replaceAll(/\r\n/g, '<br>').replaceAll(/\n/g, '<br>').replaceAll(/\r/g, '<br>');
}

function parseOptionValues(values: string[]): string[] {
    return values.flatMap((value) => value.split(/\r?\n|,/)).map((option) => option.trim()).filter(Boolean);
}

function parseCustomQuestionOptions(formData: FormData, questionIndex: number): string[] {
    const indexedPrefix = `custom-question-options-${questionIndex}-`;
    const indexedOptions = Array.from(formData.entries())
        .filter(([key]) => key.startsWith(indexedPrefix))
        .sort(([a], [b]) => {
            const aIndex = Number(a.slice(indexedPrefix.length));
            const bIndex = Number(b.slice(indexedPrefix.length));
            return aIndex - bIndex;
        })
        .map(([, value]) => String(value));

    if (indexedOptions.length) return parseOptionValues(indexedOptions);

    const rawOptions = (formData.get(`custom-question-options-${questionIndex}`) as string | null) || '';
    return parseOptionValues([rawOptions]);
}

function isSelectQuestion(type: SubmissionFormQuestion['type']): boolean {
    return type === 'single_select' || type === 'multi_select';
}

function parseBuiltInQuestion(formData: FormData, questionId: string): SubmissionFormQuestion | null {
    const question = builtInSubmissionQuestions.find((builtInQuestion) => builtInQuestion.id === questionId);
    if (!question || !formData.get(`question-${question.id}`)) return null;

    return {
        ...question,
        required: Boolean(formData.get(`required-${question.id}`))
    };
}

function parseCustomQuestion(formData: FormData, questionIndex: number): SubmissionFormQuestion | null {
    const label = (formData.get(`custom-question-${questionIndex}`) as string | null)?.trim();
    if (!label) return null;

    const type = (formData.get(`custom-question-type-${questionIndex}`) as SubmissionFormQuestion['type'] | null) || 'long_text';
    const options = parseCustomQuestionOptions(formData, questionIndex);

    return {
        id: `custom-${questionIndex}-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'question'}`,
        label,
        type,
        required: Boolean(formData.get(`custom-question-required-${questionIndex}`)),
        options: isSelectQuestion(type) ? options : undefined
    };
}

async function canManageSubmissionOwner(ownerType: SubmissionOwnerType, ownerId: string, userId: string): Promise<boolean> {
    if (ownerType === 'troupe') {
        const troupe = await getTroupe(ownerId);
        if (!troupe) return false;
        const members = await getTroupeMembers(ownerId);
        return members.some((member) => member.id === userId && member.confirmed && member.role !== 'coach');
    }
    return false;
}

function parseQuestions(formData: FormData): SubmissionFormQuestion[] {
    const questions: SubmissionFormQuestion[] = [];
    const questionOrder = formData.getAll('question-order').map((value) => String(value));
    const parsedBuiltIns = new Set<string>();
    const parsedCustomQuestions = new Set<number>();

    questionOrder.forEach((orderedQuestion) => {
        const [kind, rawIdentifier] = orderedQuestion.split(':');
        if (kind === 'builtIn') {
            if (parsedBuiltIns.has(rawIdentifier)) return;
            parsedBuiltIns.add(rawIdentifier);
            const question = parseBuiltInQuestion(formData, rawIdentifier);
            if (question) questions.push(question);
        }

        if (kind === 'custom') {
            const questionIndex = Number(rawIdentifier);
            if (!Number.isInteger(questionIndex) || parsedCustomQuestions.has(questionIndex)) return;
            parsedCustomQuestions.add(questionIndex);
            const question = parseCustomQuestion(formData, questionIndex);
            if (question) questions.push(question);
        }
    });

    builtInSubmissionQuestions.forEach((question) => {
        if (parsedBuiltIns.has(question.id)) return;
        const parsedQuestion = parseBuiltInQuestion(formData, question.id);
        if (parsedQuestion) questions.push(parsedQuestion);
    });

    for (let i = 0; i < 8; i++) {
        if (parsedCustomQuestions.has(i)) continue;
        const question = parseCustomQuestion(formData, i);
        if (question) questions.push(question);
    }

    return questions;
}

function getQuestionValidationMessage(questions: SubmissionFormQuestion[]): string | null {
    const questionWithoutOptions = questions.find((question) => isSelectQuestion(question.type) && !question.options?.length);
    if (questionWithoutOptions) return `Add at least one option for "${questionWithoutOptions.label}"`;
    return null;
}

function parseAuditionSlots(formData: FormData): AuditionSlot[] {
    const slots: AuditionSlot[] = [];
    for (let i = 0; i < 8; i++) {
        const date = (formData.get(`audition-date-${i}`) as string | null)?.trim();
        const time = (formData.get(`audition-time-${i}`) as string | null)?.trim();
        if (!date || !time) continue;
        slots.push({
            id: `${date}-${time}`.replace(/[^a-zA-Z0-9]+/g, '-'),
            dateTime: `${date} ${time}`
        });
    }
    return slots;
}

function parseCloseDateTime(formData: FormData): string | null {
    if (!formData.get('hasCloseDate')) return null;

    const rawValue = (formData.get('closesAt') as string | null)?.trim();
    if (!rawValue) return null;

    const closeDateTime = rawValue.replace('T', ' ');
    const closeDate = new Date(closeDateTime);
    if (Number.isNaN(closeDate.getTime())) return null;
    return closeDateTime;
}

export async function saveTroupeSubmissionForm(ownerId: string, prevState: void | { message?: string }, formData: FormData) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('You must be logged in to continue');
    if (!(await canManageSubmissionOwner('troupe', ownerId, userId))) throw new Error('You do not have permission to manage this form');

    const title = (formData.get('title') as string | null)?.trim() || 'Troupe Submission Form';
    const description = cleanLineBreaks((formData.get('description') as string | null) || '');
    const closesAt = parseCloseDateTime(formData);
    if (formData.get('hasCloseDate') && !closesAt) return { message: 'Enter a valid close date and time' };
    const questions = parseQuestions(formData);
    if (!questions.length) return { message: 'Choose at least one question' };
    const questionValidationMessage = getQuestionValidationMessage(questions);
    if (questionValidationMessage) return { message: questionValidationMessage };

    const hasAudition = Boolean(formData.get('hasAudition'));
    const auditionDatesTbd = hasAudition && Boolean(formData.get('auditionDatesTbd'));
    const auditionSlots = hasAudition && !auditionDatesTbd ? parseAuditionSlots(formData) : [];
    if (hasAudition && !auditionDatesTbd && !auditionSlots.length) {
        return { message: 'Add at least one audition date or mark dates TBD' };
    }

    await saveSubmissionForm({
        ownerType: 'troupe',
        ownerId,
        title,
        description: description || null,
        closesAt,
        questions,
        requiresSignIn: Boolean(formData.get('requiresSignIn')),
        hasAudition,
        auditionDatesTbd,
        auditionSlots,
        createdBy: userId,
    });

    revalidatePath(`/troupes/${ownerId}`, 'layout');
    redirect(`/troupes/${ownerId}/submissions`);
}

export async function submitSubmissionForm(formId: string, prevState: void | { message?: string }, formData: FormData) {
    const user = await getCurrentUser();

    const form = await getSubmissionFormById(formId);
    if (!form) return { message: 'This form no longer exists' };
    if (isDateTimeInPast(form.closesAt)) return { message: 'This form is closed and is no longer accepting submissions' };
    if (form.requiresSignIn && !user) throw new Error('You must be logged in to continue');

    const contactEmail = user
        ? null
        : ((formData.get('contactEmail') as string | null)?.trim().toLowerCase() || null);
    if (!user && !contactEmail) return { message: 'Email address is required' };
    if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        return { message: 'Enter a valid email address' };
    }

    const answers: { [questionId: string]: string | string[] } = {};
    const demographicUpdates: Partial<Demographics> = {};

    for (let i = 0; i < form.questions.length; i++) {
        const question = form.questions[i];
        const key = `answer-${question.id}`;
        let answer: string | string[];
        if (question.type === 'multi_select') {
            answer = formData.getAll(key).map((value) => String(value).trim()).filter(Boolean);
        } else {
            answer = cleanLineBreaks((formData.get(key) as string | null) || '');
        }
        if (question.required && (!answer || (Array.isArray(answer) && !answer.length))) {
            return { message: `${question.label} is required` };
        }
        answers[question.id] = answer;

        if (question.builtIn === 'gender_identity') demographicUpdates.genderIdentity = Array.isArray(answer) ? answer.join(', ') : answer;
        if (question.builtIn === 'orientation') demographicUpdates.orientation = Array.isArray(answer) ? answer.join(', ') : answer;
        if (question.builtIn === 'ethnicity') demographicUpdates.ethnicity = Array.isArray(answer) ? answer.join(', ') : answer;
    }

    const auditionAvailability = form.hasAudition && !form.auditionDatesTbd
        ? formData.getAll('auditionAvailability').map((value) => String(value))
        : [];
    if (form.hasAudition && !form.auditionDatesTbd && !auditionAvailability.length) {
        return { message: 'Choose at least one audition date you can attend' };
    }

    if (Object.keys(demographicUpdates).length) {
        if (user) await saveDemographics(user.id, demographicUpdates);
    }

    await saveSubmission({
        formId: form.id,
        userId: user?.id || null,
        contactEmail,
        answers,
        auditionAvailability
    });

    revalidatePath(`/${form.ownerType}s/${form.ownerId}/submissions`);
    redirect(`/submission-form/${form.ownerType}/${form.ownerId}?submitted=true`);
}

export async function saveTroupeAuditionSlotAssignments(
    ownerId: string,
    formId: string,
    assignments: { submissionId: string, slotId: string | null }[]
) {
    const userId = await getCurrentUserId();
    if (!userId) throw new Error('You must be logged in to continue');
    if (!(await canManageSubmissionOwner('troupe', ownerId, userId))) {
        throw new Error('You do not have permission to manage audition slots');
    }

    const form = await getSubmissionFormById(formId);
    if (!form || form.ownerType !== 'troupe' || form.ownerId !== ownerId || !form.hasAudition || form.auditionDatesTbd) {
        throw new Error('This audition form is no longer available');
    }

    const validSlotIds = new Set(form.auditionSlots.map((slot) => slot.id));
    const normalizedAssignments = assignments.map((assignment) => {
        if (assignment.slotId && !validSlotIds.has(assignment.slotId)) {
            throw new Error('One or more audition slot assignments are invalid');
        }
        return {
            submissionId: assignment.submissionId,
            slotId: assignment.slotId
        };
    });

    await saveAuditionSlotAssignments(form.id, normalizedAssignments);
    revalidatePath(`/troupes/${ownerId}/submissions/auditions`);
    revalidatePath(`/troupes/${ownerId}/submissions`);
}
