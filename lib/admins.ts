import { TheatreClaim } from "@/types";
import { camelCaseObject } from "./helper-functions";
import { postNotification } from "./notifications";
import { supabaseAdmin } from "./supabase-server";

export async function isSiteAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false;
  const { count, error } = await supabaseAdmin
    .from('admins')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw error;
  return Boolean(count);
}

export async function getSiteAdminIds(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('admins')
    .select('user_id');
  if (error) throw error;
  return (data || []).map((admin: { user_id: string }) => admin.user_id);
}

export async function submitTheatreClaim(theatreId: string, claimantId: string, proof: string): Promise<void> {
  const { data: existingClaim, error: existingClaimError } = await supabaseAdmin
    .from('theatre_claims')
    .select('id')
    .eq('theatre_id', theatreId)
    .eq('claimant_id', claimantId)
    .eq('status', 'pending')
    .maybeSingle();
  if (existingClaimError) throw existingClaimError;
  if (existingClaim) return;

  const { error } = await supabaseAdmin
    .from('theatre_claims')
    .insert({
      theatre_id: theatreId,
      claimant_id: claimantId,
      proof,
      status: 'pending',
    });
  if (error) throw error;
}

export async function getPendingTheatreClaims(): Promise<TheatreClaim[]> {
  const { data, error } = await supabaseAdmin
    .from('theatre_claims')
    .select('*')
    .eq('status', 'pending')
    .order('claimed_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(camelCaseObject) as TheatreClaim[];
}

export async function approveTheatreClaim(claimId: string, reviewerId: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .rpc('approve_theatre_claim', {
      p_claim_id: claimId,
      p_reviewer_id: reviewerId,
    });
  if (error) throw error;
  if (!data) return null;

  const claim = camelCaseObject(data) as TheatreClaim;
  await postNotification(reviewerId, [claim.claimantId], 'made_admin', `theatre,${claim.theatreId}`);
  return claim.theatreId;
}

export async function rejectTheatreClaim(claimId: string, reviewerId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('theatre_claims')
    .update({
      status: 'rejected',
      reviewed_by: reviewerId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', claimId)
    .eq('status', 'pending');
  if (error) throw error;
}
