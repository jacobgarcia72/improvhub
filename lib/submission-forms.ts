'use server';

import {
    AuditionSlot,
    Demographics,
    SubmissionForm,
    SubmissionFormQuestion,
    SubmissionFormSubmission,
    SubmissionOwnerType,
} from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { camelCaseObject, getRandomNumberString, snakeCaseObject } from "./helper-functions";
import { postNotification } from "./notifications";

function parseSubmissionForm(row: Record<string, unknown>): SubmissionForm {
    const parsed = camelCaseObject(row) as SubmissionForm;
    parsed.questions = (parsed.questions || []) as SubmissionFormQuestion[];
    parsed.auditionSlots = (parsed.auditionSlots || []) as AuditionSlot[];
    parsed.requiresSignIn = parsed.requiresSignIn !== false;
    parsed.hasAudition = Boolean(parsed.hasAudition);
    parsed.auditionDatesTbd = Boolean(parsed.auditionDatesTbd);
    parsed.closesAt = parsed.closesAt || null;
    return parsed;
}

function parseSubmission(row: Record<string, unknown>): SubmissionFormSubmission {
    const parsed = camelCaseObject(row) as SubmissionFormSubmission;
    parsed.answers = parsed.answers || {};
    parsed.auditionAvailability = parsed.auditionAvailability || [];
    parsed.assignedAuditionSlotId = parsed.assignedAuditionSlotId || null;
    return parsed;
}

export async function getSubmissionForm(ownerType: SubmissionOwnerType, ownerId: string): Promise<SubmissionForm | null> {
    const { data, error } = await supabaseAdmin
        .from('submission_forms')
        .select('*')
        .eq('owner_type', ownerType)
        .eq('owner_id', ownerId)
        .maybeSingle();
    if (error) throw error;
    return data ? parseSubmissionForm(data) : null;
}

export async function getSubmissionFormById(id: string): Promise<SubmissionForm | null> {
    const { data, error } = await supabaseAdmin
        .from('submission_forms')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? parseSubmissionForm(data) : null;
}

export async function saveSubmissionForm(form: Omit<SubmissionForm, 'id' | 'updatedAt'> & { id?: string }): Promise<string> {
    const existing = await getSubmissionForm(form.ownerType, form.ownerId);
    const id = existing?.id || form.id || `${form.ownerType}-${form.ownerId}-${getRandomNumberString(8)}`;
    const payload = snakeCaseObject({
        ...form,
        id,
        updatedAt: new Date().toISOString()
    });
    const { error } = await supabaseAdmin
        .from('submission_forms')
        .upsert(payload, { onConflict: 'owner_type,owner_id' });
    if (error) throw error;
    return id;
}

export async function deleteSubmissionFormData(formId: string): Promise<void> {
    const { error: newsError } = await supabaseAdmin
        .from('news')
        .delete()
        .eq('news_type', 'new_submission_form')
        .eq('news_item_id', formId);
    if (newsError) throw newsError;

    const { error: formNotificationError } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('type', 'new_submission_form')
        .eq('data', formId);
    if (formNotificationError) throw formNotificationError;

    const { error: submissionNotificationError } = await supabaseAdmin
        .from('notifications')
        .delete()
        .eq('type', 'new_submission')
        .like('data', `${formId},%`);
    if (submissionNotificationError) throw submissionNotificationError;

    const { error: formError } = await supabaseAdmin
        .from('submission_forms')
        .delete()
        .eq('id', formId);
    if (formError) throw formError;
}

export async function getSubmission(formId: string, userId: string): Promise<SubmissionFormSubmission | null> {
    const { data, error } = await supabaseAdmin
        .from('submission_form_submissions')
        .select('*')
        .eq('form_id', formId)
        .eq('user_id', userId)
        .maybeSingle();
    if (error) throw error;
    return data ? parseSubmission(data) : null;
}

export async function getSubmissionByContactEmail(formId: string, contactEmail: string): Promise<SubmissionFormSubmission | null> {
    const { data, error } = await supabaseAdmin
        .from('submission_form_submissions')
        .select('*')
        .eq('form_id', formId)
        .ilike('contact_email', contactEmail)
        .maybeSingle();
    if (error) throw error;
    return data ? parseSubmission(data) : null;
}

export async function getSubmissionById(id: string): Promise<SubmissionFormSubmission | null> {
    const { data, error } = await supabaseAdmin
        .from('submission_form_submissions')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? parseSubmission(data) : null;
}

export async function getSubmissions(formId: string): Promise<SubmissionFormSubmission[]> {
    const { data, error } = await supabaseAdmin
        .from('submission_form_submissions')
        .select('*')
        .eq('form_id', formId)
        .order('submitted_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(parseSubmission);
}

export async function saveSubmission(submission: Omit<SubmissionFormSubmission, 'id' | 'submittedAt' | 'assignedAuditionSlotId'>): Promise<string> {
    const existing = submission.userId
        ? await getSubmission(submission.formId, submission.userId)
        : submission.contactEmail
            ? await getSubmissionByContactEmail(submission.formId, submission.contactEmail)
            : null;
    const submitterKey = submission.userId || submission.contactEmail?.replace(/[^a-zA-Z0-9]+/g, '-') || 'anonymous';
    const id = existing?.id || `${submission.formId}-${submitterKey}-${getRandomNumberString(6)}`;
    const assignedAuditionSlotId = existing?.assignedAuditionSlotId && submission.auditionAvailability.includes(existing.assignedAuditionSlotId)
        ? existing.assignedAuditionSlotId
        : null;
    const { error } = await supabaseAdmin
        .from('submission_form_submissions')
        .upsert(snakeCaseObject({
            ...submission,
            id,
            assignedAuditionSlotId,
            submittedAt: new Date().toISOString()
        }), { onConflict: 'id' });
    if (error) throw error;
    return id;
}

export async function saveAuditionSlotAssignments(
    formId: string,
    assignments: { submissionId: string, slotId: string | null }[]
): Promise<void> {
    const form = await getSubmissionFormById(formId);
    if (!form) throw new Error('This audition form is no longer available');
    const submissions = await getSubmissions(formId);
    const submissionsById = new Map(submissions.map((submission) => [submission.id, submission]));
    const validAssignments = assignments.filter((assignment) => submissionsById.has(assignment.submissionId));

    validAssignments.forEach((assignment) => {
        const submission = submissionsById.get(assignment.submissionId);
        if (assignment.slotId && !submission?.auditionAvailability.includes(assignment.slotId)) {
            throw new Error('Submitters can only be assigned to slots they marked as available');
        }
    });

    await Promise.all(validAssignments
        .map(async (assignment) => {
            const { error } = await supabaseAdmin
                .from('submission_form_submissions')
                .update({ assigned_audition_slot_id: assignment.slotId })
                .eq('id', assignment.submissionId)
                .eq('form_id', formId);
            if (error) throw error;
        }));

    const assignmentsToNotify = validAssignments.filter((assignment) => {
        const submission = submissionsById.get(assignment.submissionId);
        return Boolean(
            assignment.slotId
            && submission?.userId
            && submission.assignedAuditionSlotId !== assignment.slotId
        );
    });

    await Promise.all(assignmentsToNotify.map((assignment) => {
        const submission = submissionsById.get(assignment.submissionId);
        return postNotification(
            form.ownerId,
            [submission?.userId as string],
            'audition_slot_assigned',
            `${formId},${assignment.submissionId},${assignment.slotId}`
        );
    }));
}

export async function getDemographics(userId: string): Promise<Demographics | null> {
    const { data, error } = await supabaseAdmin
        .from('demographics')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as Demographics : null;
}

export async function saveDemographics(userId: string, updates: Partial<Demographics>): Promise<void> {
    const existing = await getDemographics(userId);
    const payload = snakeCaseObject({
        userId,
        genderIdentity: updates.genderIdentity ?? existing?.genderIdentity ?? null,
        orientation: updates.orientation ?? existing?.orientation ?? null,
        ethnicity: updates.ethnicity ?? existing?.ethnicity ?? null,
        updatedAt: new Date().toISOString()
    });
    const { error } = await supabaseAdmin
        .from('demographics')
        .upsert(payload, { onConflict: 'user_id' });
    if (error) throw error;
}
