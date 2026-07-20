/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Troupe, Role, TroupeMember, User } from "@/types";
import { supabaseAdmin } from './supabase-server';
import { getCitiesWithinRange } from "./location";
import { camelCaseObject, getRandomElements, removeLeadingArticles, snakeCaseObject } from "./helper-functions";
import { getCurrentUser, getCurrentUserId } from "./users";
import { destroyImage } from "./cloudinary";
import { revalidatePath } from "next/cache";
import { createNewsFeedItem } from "./news";
import { postNotification } from "./notifications";

export async function getTroupe(id: string): Promise<Troupe | null> {
    const { data, error } = await supabaseAdmin
        .from('troupes')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as Troupe : null;
}

export async function getAllTroupes(): Promise<{ name: string, id: string, image?: string }[]> {
    const { data, error } = await supabaseAdmin
        .from('troupes')
        .select('name, id, image');
    if (error) throw error;
    return (data || []).map((troupe: any) => ({
        name: troupe.name,
        id: troupe.id,
        image: troupe.image || undefined
    }));
}

export async function getTroupesByTheatre(theatre: string) {
    const { data, error } = await supabaseAdmin
        .from('troupes')
        .select('*')
        .contains('theatres', [theatre]);
    if (error) throw error;
    return (data || []).map(camelCaseObject);
}

export async function getOpenTroupes(user: User, role: Role): Promise<Troupe[]> {
    // Map role to the looking_for_* field
    const roleFieldMap: Record<Role, string | null> = {
        'player': 'looking_for_players',
        'coach': 'looking_for_coach',
        'musician': 'looking_for_musician',
        'director': null,
        'tech': null,
    };

    const lookingForField = roleFieldMap[role];
    if (!lookingForField) return []; // Role not applicable for troupes
    const { id: userId, theatres, state, city } = user;

    // Get confirmed memberships for this user
    const { data: userMemberships, error: membershipsError } = await supabaseAdmin
        .from('troupe_members')
        .select('troupe')
        .eq('id', userId)
        .eq('confirmed', true);
    if (membershipsError) throw membershipsError;

    const userTroupeIds = new Set(userMemberships?.map((m: any) => m.troupe) || []);

    // Normalize input for case-insensitive comparison
    const normalizedCity = city?.toLowerCase();
    const normalizedState = state?.toLowerCase();
    const normalizedTheatres = theatres?.map(t => removeLeadingArticles(t).toLowerCase());

    // Query by role first, then filter by city/state or theatre locally.
    // This is safer than using DB-specific array overlap operators until schema is verified.
    const { data: allTroupes, error: troupesError } = await supabaseAdmin
        .from('troupes')
        .select('*')
        .eq(lookingForField, true)
        .limit(250);
    if (troupesError) throw troupesError;

    const openTroupes = (allTroupes || [])
        .filter((troupe: any) => {
            if (userTroupeIds.has(troupe.id)) return false;

            const cityStateMatch = troupe.city && troupe.state &&
                troupe.city.toLowerCase() === normalizedCity &&
                troupe.state.toLowerCase() === normalizedState;

            const troupeTheatres = (troupe.theatres || []).map((t: string) => removeLeadingArticles(t).toLowerCase());
            const theatreMatch = normalizedTheatres?.length && normalizedTheatres.some((theatre: string) =>
                troupeTheatres.some((troupeTheatre: string) =>
                    troupeTheatre.includes(theatre) || theatre.includes(troupeTheatre)
                )
            );

            return cityStateMatch || theatreMatch;
        })
        .map(camelCaseObject);

    return openTroupes.length ? getRandomElements(openTroupes, 6) : [] as Troupe[];
}

export async function getSuggestionsForTroupe(role: Role, troupe?: Troupe | string | null): Promise<User[]> {
    // Map role to the DB column for open-to-troupe preferences
    const roleFieldMap: Record<Role, string | null> = {
        'player': 'open_to_join_troupe',
        'coach': 'open_to_coach_troupe',
        'musician': 'open_to_accompany_troupe',
        'director': null,
        'tech': null,
    };

    const openToField = roleFieldMap[role];
    if (!openToField) return []; // Role not applicable for troupes

    // Normalize input for case-insensitive comparison (used later)
    // We'll perform two DB queries to avoid a full table scan:
    // 1) users with matching city/state
    // 2) users whose theatres overlap the given theatres

    let troupeId = '';
    let theatres: string[] = [];
    let state = '';
    let city = '';
    let troupeMemberIds: Set<string> = new Set();
    if (troupe) {
        const troupeObject = typeof troupe === 'string' ? await getTroupe(troupe) : troupe;
        if (troupeObject) {
            troupeId = troupeObject?.id;
            theatres = troupeObject?.theatres;
            state = troupeObject?.state || '';
            city = troupeObject?.city || '';
            // Get confirmed memberships for this troupe
            const { data: troupeMemberships } = await supabaseAdmin
                .from('troupe_members')
                .select('troupe')
                .eq('id', troupeId)
                .eq('confirmed', true);
            troupeMemberIds = new Set(troupeMemberships?.map((m: any) => m.id as string) || []);
        }
    } else {
        const currentUser = await getCurrentUser();
        theatres = currentUser?.theatres || [];
        state = currentUser?.state || '';
        city = currentUser?.city || '';
    }

    // Normalize input for case-insensitive comparison
    const normalizedCity = city?.toLowerCase();
    const normalizedState = state?.toLowerCase();
    const normalizedTheatres = theatres?.map(t => removeLeadingArticles(t).toLowerCase());

    // Load candidates for this role and apply theater/location filtering in JS.
    const { data: usersData, error: usersError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq(openToField, true)
        .limit(250);
    if (usersError) throw usersError;

    const users = usersData || [];
    const availableUsers = users
        .filter((user: any) => {
            if (troupeMemberIds?.has(user.id)) return false;

            const cityStateMatch = user.city && user.state &&
                user.city.toLowerCase() === normalizedCity &&
                user.state.toLowerCase() === normalizedState;

            const userTheatres = (user.theatres || []).map((t: string) => removeLeadingArticles(t).toLowerCase());
            const theatreMatch = normalizedTheatres?.length && normalizedTheatres.some((theatre: string) =>
                userTheatres.some((userTheatre: string) =>
                    userTheatre.includes(theatre) || theatre.includes(userTheatre)
                )
            );

            return cityStateMatch || theatreMatch;
        })
        .map(camelCaseObject);

    return availableUsers.length ? getRandomElements(availableUsers, 6) : [] as User[];
}

export async function getTroupesInRange(cityOrZipcode: string, miles: number) {
    const citiesInRange = getCitiesWithinRange(cityOrZipcode, miles);
    if (!citiesInRange.length) return [];
    const { data, error } = await supabaseAdmin
        .from('troupes')
        .select('*');
    if (error) throw error;
    return (data || [])
        .filter((troupe: any) => troupe.city && troupe.state && citiesInRange.includes(`${troupe.city} ${troupe.state}`))
        .map(camelCaseObject);
}

export async function getTroupeMembership(userId: string, troupeId: string, role: Role): Promise<TroupeMember | null> {
    const { data, error } = await supabaseAdmin
        .from('troupe_members')
        .select('*')
        .eq('id', userId)
        .eq('troupe', troupeId)
        .eq('role', role)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as TroupeMember : null;
}

export async function getTroupeMembershipsByUser(id: string): Promise<TroupeMember[]> {
    const { data, error } = await supabaseAdmin
        .from('troupe_members')
        .select('*')
        .eq('id', id);
    if (error) throw error;
    if (!data?.length) return [];
    return (data || []).map(camelCaseObject) as TroupeMember[];
}

export async function getTroupesByUser(id: string): Promise<Troupe[]> {
    const { data: memberships, error: membershipError } = await supabaseAdmin
        .from('troupe_members')
        .select('troupe')
        .eq('id', id);
    if (membershipError) throw membershipError;
    if (!memberships?.length) return [];
    const troupeIds = memberships.map((membership: any) => membership.troupe);
    const { data, error } = await supabaseAdmin
        .from('troupes')
        .select('*')
        .in('id', troupeIds);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as Troupe[];
}

export async function getTroupeMembers(troupeId: string, includeCoaches: boolean = false): Promise<TroupeMember[]> {
    const { data, error } = await supabaseAdmin
        .from('troupe_members')
        .select('*')
        .eq('troupe', troupeId);
    if (error) throw error;
    let res = data || [];
    if (!includeCoaches) res = res.filter((m: TroupeMember) => m.role !== 'coach')
    return res.map(camelCaseObject) as TroupeMember[];
}

export async function getTroupeInvitations(userId: string): Promise<TroupeMember[]> {
    const { data, error } = await supabaseAdmin
        .from('troupe_members')
        .select('*')
        .eq('id', userId)
        .eq('confirmed', false);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as TroupeMember[];
}

export async function respondToTroupeInvitation(troupeId: string, userId: string, role: string, accept: boolean): Promise<void> {
    if (accept) {
        const { error, data } = await supabaseAdmin
            .from('troupe_members')
            .update({ confirmed: true })
            .eq('troupe', troupeId)
            .eq('id', userId)
            .eq('role', role)
            .select('added_by')
            .single();
        if (error) throw error;
        if (data.added_by) postNotification(userId, [data.added_by], 'confirmed_troupe', `${troupeId},${role}`);
        createNewsFeedItem('friend', userId, "joined_troupe", troupeId, null, role);
        revalidatePath('/troupes', 'layout')
    } else {
        const { error } = await supabaseAdmin
            .from('troupe_members')
            .delete()
            .eq('troupe', troupeId)
            .eq('id', userId)
            .eq('role', role);
        if (error) throw error;
        await deleteTroupeIfNooneLeft(troupeId);
    }
}

export async function saveTroupe(troupe: Troupe, members: { name: string, id: string | null, role: Role }[]): Promise<string> {
    let creatorId = await getCurrentUserId() || '';
    if (!creatorId) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('You must be logged in to continue');
        } else {
            creatorId = members[0].id || '';
        }
    }
    const baseId = troupe.id;
    let troupeId = baseId;
    let counter = 1;
    let existingTroupe = await getTroupe(troupeId);
    while (existingTroupe) {
        counter++;
        troupeId = `${baseId}-${counter}`;
        existingTroupe = await getTroupe(troupeId);
    }
    troupe.id = troupeId;
    const { error: troupeInsertError } = await supabaseAdmin
        .from('troupes')
        .insert({
            id: troupe.id,
            name: troupe.name,
            image: troupe.image,
            photo_credit: troupe.photoCredit,
            city: troupe.city,
            state: troupe.state,
            theatres: troupe.theatres,
            looking_for_players: troupe.lookingForPlayers,
            looking_for_coach: troupe.lookingForCoach,
            looking_for_musician: troupe.lookingForMusician,
            description: troupe.description
        });
    if (troupeInsertError) console.error(troupeInsertError);

    const timestamp = new Date().toISOString();
    const memberRows = members.map(({ name, id, role }) => ({
        troupe: troupe.id,
        name,
        id,
        role,
        date_added: timestamp,
        added_by: creatorId,
        confirmed: id ? id === creatorId : null
    }));
    if (memberRows.length) {
        const { error: memberInsertError } = await supabaseAdmin
            .from('troupe_members')
            .insert(memberRows);
        if (memberInsertError) throw memberInsertError;
    }
    const usersToNotify = memberRows.filter((m) => m.id !== null && m.confirmed === false);
    ['player', 'musician', 'coach'].forEach(async (role) => {
        const usersWithRole = usersToNotify.filter((m) => m.role === role);
        if (usersWithRole.length) await postNotification(creatorId, usersWithRole.map(m => m.id || ''), 'added_to_troupe', `${troupe.id},${role}`);
    })
    createNewsFeedItem('friend', creatorId, 'new_troupe', troupeId);
    return troupe.id;
}

export async function updateTroupe(troupeId: string, updates: Partial<Troupe>, members: { name: string, id: string | null, role: Role }[], addedBy: string): Promise<boolean> {
    if (Object.keys(updates).length) {
        const { error } = await supabaseAdmin
            .from('troupes')
            .update(snakeCaseObject(updates))
            .eq('id', troupeId);
        if (error) throw error;
    }

    const existingMembers = await getTroupeMembers(troupeId, true);
    const getExistingMember = (member: { name: string, id: string | null, role: Role }) => (
        existingMembers.find((existing) => (
            existing.role === member.role &&
            existing.id === member.id &&
            existing.name === member.name
        ))
    );

    const { error: deleteError } = await supabaseAdmin
        .from('troupe_members')
        .delete()
        .eq('troupe', troupeId);
    if (deleteError) throw deleteError;

    const timestamp = new Date().toISOString();
    const memberRows = members.map((member) => {
        const existingMember = getExistingMember(member);
        let confirmed: boolean | null = null;
        if (typeof existingMember?.confirmed === 'boolean') {
            confirmed = existingMember.confirmed;
        } else if (member.id) {
            confirmed = member.id === addedBy;
        }
        return {
            troupe: troupeId,
            name: member.name,
            id: member.id,
            role: member.role,
            date_added: existingMember?.dateAdded || timestamp,
            added_by: existingMember?.addedBy || addedBy,
            confirmed
        };
    });
    if (memberRows.length) {
        const { error: memberInsertError } = await supabaseAdmin
            .from('troupe_members')
            .insert(memberRows);
        if (memberInsertError) throw memberInsertError;
        const usersToNotify = memberRows.filter((m) => m.id !== null && m.confirmed === false && m.date_added === timestamp);
        ['player', 'musician', 'coach'].forEach(async (role) => {
            const usersWithRole = usersToNotify.filter((m) => m.role === role);
            if (usersWithRole.length) await postNotification(addedBy, usersWithRole.map(m => m.id || ''), 'added_to_troupe', `${troupeId},${role}`);
        })
    }

    return true;
}

export async function updateTroupeDetails(troupeId: string, updates: Partial<Troupe>): Promise<boolean> {
    if (!Object.keys(updates).length) return true;
    const { error } = await supabaseAdmin
        .from('troupes')
        .update(snakeCaseObject(updates))
        .eq('id', troupeId);
    if (error) throw error;
    return true;
}

export async function leaveTroupe(troupeId: string, userId: string): Promise<{ deletedTroupe: boolean }> {
    const { data: confirmedMemberships, error: membershipError } = await supabaseAdmin
        .from('troupe_members')
        .select('*')
        .eq('troupe', troupeId)
        .eq('id', userId)
        .eq('confirmed', true);
    if (membershipError) throw membershipError;
    if (!confirmedMemberships?.length) return { deletedTroupe: false };

    const { error: deleteError } = await supabaseAdmin
        .from('troupe_members')
        .delete()
        .eq('troupe', troupeId)
        .eq('id', userId);
    if (deleteError) throw deleteError;

    const deletedTroupe = await deleteTroupeIfNooneLeft(troupeId);
    return { deletedTroupe };
}

async function deleteTroupeIfNooneLeft(troupeId: string): Promise<boolean> {
    const { count, error: countError } = await supabaseAdmin
        .from('troupe_members')
        .select('*', { count: 'exact', head: true })
        .eq('troupe', troupeId)
        .neq('id', '')
        .neq('role', 'coach');
    if (countError) throw countError;
    if ((count ?? 0) > 0) {
        return false;
    }
    const troupe = await getTroupe(troupeId);
    if (troupe) await destroyImage(troupe.image);

    const { error: deleteMembersError } = await supabaseAdmin
        .from('troupe_members')
        .delete()
        .eq('troupe', troupeId);
    if (deleteMembersError) throw deleteMembersError;

    const { error: deleteTroupeError } = await supabaseAdmin
        .from('troupes')
        .delete()
        .eq('id', troupeId);
    if (deleteTroupeError) throw deleteTroupeError;

    const { error: deleteCastError } = await supabaseAdmin
        .from('showing_cast')
        .delete()
        .eq('role', 'troupe')
        .eq('id', troupeId);
    if (deleteCastError) throw deleteCastError;

    const { error: deleteFollowError } = await supabaseAdmin
        .from('follows')
        .delete()
        .eq('follow_id', troupeId)
        .eq('type', 'troupe');
    if (deleteFollowError) throw deleteFollowError;

    return true;
}
