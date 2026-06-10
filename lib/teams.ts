/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Team, Role, TeamMember, User } from "@/types";
import { supabaseAdmin } from './supabase-server';
import { getCitiesWithinRange } from "./location";
import { camelCaseObject, removeLeadingArticles, snakeCaseObject } from "./helper-functions";
import { getCurrentUser } from "./users";
import { destroyImage } from "./cloudinary";
import { revalidatePath } from "next/cache";


export async function getTeam(id: string): Promise<Team | null> {
    const { data, error } = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? camelCaseObject(data) as Team : null;
}

export async function getAllTeams(): Promise<{ name: string, id: string, image?: string }[]> {
    const { data, error } = await supabaseAdmin
        .from('teams')
        .select('name, id, image');
    if (error) throw error;
    return (data || []).map((team: any) => ({
        name: team.name,
        id: team.id,
        image: team.image || undefined
    }));
}

export async function getTeamsByTheatre(theatre: string) {
    const { data, error } = await supabaseAdmin
        .from('teams')
        .select('*')
        .or(`theatres.text.ilike.%${removeLeadingArticles(theatre)}%`);
    if (error) throw error;
    return (data || []).map(camelCaseObject);
}

export async function getOpenTeams(user: User, role: Role): Promise<Team[]> {
    // Map role to the looking_for_* field
    const roleFieldMap: Record<Role, string | null> = {
        'player': 'looking_for_players',
        'coach': 'looking_for_coach',
        'musician': 'looking_for_musician',
        'director': null,
        'tech': null,
    };

    const lookingForField = roleFieldMap[role];
    if (!lookingForField) return []; // Role not applicable for teams

    // Get all teams
    const { data: allTeams, error: teamsError } = await supabaseAdmin
        .from('teams')
        .select('*');
    if (teamsError) throw teamsError;
    if (!allTeams || !allTeams.length) return [];

    const { id: userId, theatres, state, city } = user;

    // Get confirmed memberships for this user
    const { data: userMemberships, error: membershipsError } = await supabaseAdmin
        .from('team_members')
        .select('team')
        .eq('id', userId)
        .eq('confirmed', true);
    if (membershipsError) throw membershipsError;

    const userTeamIds = new Set(userMemberships?.map((m: any) => m.team) || []);

    // Normalize input for case-insensitive comparison
    const normalizedCity = city?.toLowerCase();
    const normalizedState = state?.toLowerCase();
    const normalizedTheatres = theatres?.map(t => removeLeadingArticles(t).toLowerCase());

    // Filter teams
    const openTeams = (allTeams || [])
        .filter((team: any) => {
            // Don't return teams where user is already a confirmed member
            if (userTeamIds.has(team.id)) return false;

            // Check if team is looking for this role
            if (!team[lookingForField]) return false;

            // Check location match (city AND state)
            const cityStateMatch = team.city && team.state &&
                team.city.toLowerCase() === normalizedCity &&
                team.state.toLowerCase() === normalizedState;

            // Check theatre match (at least one theatre)
            const teamTheatres = (team.theatres || []).map((t: string) => removeLeadingArticles(t).toLowerCase());
            const theatreMatch = normalizedTheatres?.length && normalizedTheatres.some((theatre: string) =>
                teamTheatres.some((teamTheatre: string) =>
                    teamTheatre.includes(theatre) || theatre.includes(teamTheatre)
                )
            );

            return cityStateMatch || theatreMatch;
        })
        .map(camelCaseObject);

    return openTeams as Team[];
}

export async function getTeamsInRange(cityOrZipcode: string, miles: number) {
    const citiesInRange = getCitiesWithinRange(cityOrZipcode, miles);
    if (!citiesInRange.length) return [];
    const { data, error } = await supabaseAdmin
        .from('teams')
        .select('*');
    if (error) throw error;
    return (data || [])
        .filter((team: any) => team.city && team.state && citiesInRange.includes(`${team.city} ${team.state}`))
        .map(camelCaseObject);
}

export async function getTeamMembershipsByUser(id: string): Promise<TeamMember[]> {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('id', id);
    if (error) throw error;
    if (!data?.length) return [];
    return (data || []).map(camelCaseObject) as TeamMember[];
}

export async function getTeamsByUser(id: string): Promise<Team[]> {
    const { data: memberships, error: membershipError } = await supabaseAdmin
        .from('team_members')
        .select('team')
        .eq('id', id);
    if (membershipError) throw membershipError;
    if (!memberships?.length) return [];
    const teamIds = memberships.map((membership: any) => membership.team);
    const { data, error } = await supabaseAdmin
        .from('teams')
        .select('*')
        .in('id', teamIds);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as Team[];
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('team', teamId);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as TeamMember[];
}

export async function getTeamInvitations(userId: string): Promise<TeamMember[]> {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('id', userId)
        .eq('confirmed', false);
    if (error) throw error;
    return (data || []).map(camelCaseObject) as TeamMember[];
}

export async function respondToTeamInvitation(teamId: string, userId: string, role: string, accept: boolean): Promise<void> {
    if (accept) {
        const { error } = await supabaseAdmin
            .from('team_members')
            .update({ confirmed: true })
            .eq('team', teamId)
            .eq('id', userId)
            .eq('role', role);
        revalidatePath('/teams', 'layout')
        if (error) throw error;
    } else {
        const { error } = await supabaseAdmin
            .from('team_members')
            .delete()
            .eq('team', teamId)
            .eq('id', userId)
            .eq('role', role);
        if (error) throw error;
        await deleteTeamIfNooneLeft(teamId);
    }
}

export async function saveTeam(team: Team, members: { name: string, id: string | null, role: Role }[]): Promise<string> {
    const baseId = team.id;
    let teamId = baseId;
    let counter = 1;
    let existingTeam = await getTeam(teamId);
    while (existingTeam) {
        counter++;
        teamId = `${baseId}-${counter}`;
        existingTeam = await getTeam(teamId);
    }
    team.id = teamId;
    const { error: teamInsertError } = await supabaseAdmin
        .from('teams')
        .insert({
            id: team.id,
            name: team.name,
            image: team.image,
            photo_credit: team.photoCredit,
            city: team.city,
            state: team.state,
            theatres: team.theatres,
            looking_for_players: team.lookingForPlayers,
            looking_for_coach: team.lookingForCoach,
            looking_for_musician: team.lookingForMusician,
            description: team.description
        });
    if (teamInsertError) console.error(teamInsertError);

    const creator = (await getCurrentUser())?.id;
    const timestamp = new Date().toISOString();
    const memberRows = members.map(({ name, id, role }) => ({
        team: team.id,
        name,
        id,
        role,
        date_added: timestamp,
        added_by: creator,
        confirmed: id ? id === creator : null
    }));
    if (memberRows.length) {
        const { error: memberInsertError } = await supabaseAdmin
            .from('team_members')
            .insert(memberRows);
        if (memberInsertError) throw memberInsertError;
    }
    return team.id;
}

export async function updateTeam(teamId: string, updates: Partial<Team>, members: { name: string, id: string | null, role: Role }[], addedBy: string): Promise<boolean> {
    if (Object.keys(updates).length) {
        const { error } = await supabaseAdmin
            .from('teams')
            .update(snakeCaseObject(updates))
            .eq('id', teamId);
        if (error) throw error;
    }

    const existingMembers = await getTeamMembers(teamId);
    const getExistingMember = (member: { name: string, id: string | null, role: Role }) => (
        existingMembers.find((existing) => (
            existing.role === member.role &&
            existing.id === member.id &&
            existing.name === member.name
        ))
    );

    const { error: deleteError } = await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('team', teamId);
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
            team: teamId,
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
            .from('team_members')
            .insert(memberRows);
        if (memberInsertError) throw memberInsertError;
    }

    return true;
}

export async function updateTeamDetails(teamId: string, updates: Partial<Team>): Promise<boolean> {
    if (!Object.keys(updates).length) return true;
    const { error } = await supabaseAdmin
        .from('teams')
        .update(snakeCaseObject(updates))
        .eq('id', teamId);
    if (error) throw error;
    return true;
}

export async function leaveTeam(teamId: string, userId: string): Promise<{ deletedTeam: boolean }> {
    const { data: confirmedMemberships, error: membershipError } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('team', teamId)
        .eq('id', userId)
        .eq('confirmed', true);
    if (membershipError) throw membershipError;
    if (!confirmedMemberships?.length) return { deletedTeam: false };

    const { error: deleteError } = await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('team', teamId)
        .eq('id', userId);
    if (deleteError) throw deleteError;

    const deletedTeam = await deleteTeamIfNooneLeft(teamId);
    return { deletedTeam };
}

async function deleteTeamIfNooneLeft(teamId: string): Promise<boolean> {
    const { count, error: countError } = await supabaseAdmin
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team', teamId)
        .neq('id', '')
        .neq('role', 'coach');
    if (countError) throw countError;
    if ((count ?? 0) > 0) {
        return false;
    }
    const team = await getTeam(teamId);
    if (team) await destroyImage(team.image);

    const { error: deleteMembersError } = await supabaseAdmin
        .from('team_members')
        .delete()
        .eq('team', teamId);
    if (deleteMembersError) throw deleteMembersError;

    const { error: deleteTeamError } = await supabaseAdmin
        .from('teams')
        .delete()
        .eq('id', teamId);
    if (deleteTeamError) throw deleteTeamError;

    const { error: deleteCastError } = await supabaseAdmin
        .from('showing_cast')
        .delete()
        .eq('role', 'team')
        .eq('id', teamId);
    if (deleteCastError) throw deleteCastError;

    const { error: deleteFollowError } = await supabaseAdmin
        .from('follows')
        .delete()
        .eq('follow_id', teamId)
        .eq('type', 'team');
    if (deleteFollowError) throw deleteFollowError;

    return true;
}
