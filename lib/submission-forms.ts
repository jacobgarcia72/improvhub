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

function parseSubmissionForm(row: Record<string, unknown>): SubmissionForm {
    const parsed = camelCaseObject(row) as SubmissionForm;
    parsed.questions = (parsed.questions || []) as SubmissionFormQuestion[];
    parsed.auditionSlots = (parsed.auditionSlots || []) as AuditionSlot[];
    parsed.requiresSignIn = parsed.requiresSignIn !== false;
    parsed.hasAudition = Boolean(parsed.hasAudition);
    parsed.auditionDatesTbd = Boolean(parsed.auditionDatesTbd);
    return parsed;
}

function parseSubmission(row: Record<string, unknown>): SubmissionFormSubmission {
    const parsed = camelCaseObject(row) as SubmissionFormSubmission;
    parsed.answers = parsed.answers || {};
    parsed.auditionAvailability = parsed.auditionAvailability || [];
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

export async function saveSubmission(submission: Omit<SubmissionFormSubmission, 'id' | 'submittedAt'>): Promise<string> {
    const existing = submission.userId
        ? await getSubmission(submission.formId, submission.userId)
        : submission.contactEmail
            ? await getSubmissionByContactEmail(submission.formId, submission.contactEmail)
            : null;
    const submitterKey = submission.userId || submission.contactEmail?.replace(/[^a-zA-Z0-9]+/g, '-') || 'anonymous';
    const id = existing?.id || `${submission.formId}-${submitterKey}-${getRandomNumberString(6)}`;
    const { error } = await supabaseAdmin
        .from('submission_form_submissions')
        .upsert(snakeCaseObject({
            ...submission,
            id,
            submittedAt: new Date().toISOString()
        }), { onConflict: 'form_id,user_id' });
    if (error) throw error;
    return id;
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
