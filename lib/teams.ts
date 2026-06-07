/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { Team, Role, TeamMember } from "@/types";
import { supabaseAdmin } from './supabase-server';
import { getCitiesWithinRange } from "./location";
import { prepDataForDb, removeLeadingArticles } from "./helper-functions";
import { getCurrentUser } from "./users";
import { destroyImage } from "./cloudinary";

const convertDataToTeam = (data: { [key: string]: any }): Team => {
    return {
        id: data.id || '',
        name: data.name || '',
        image: data.image || null,
        photoCredit: data.photo_credit || null,
        city: data.city || null,
        state: data.state || null,
        theatres: typeof data.theatres === 'string' ? data.theatres.split(',') : data.theatres || [],
        lookingForPlayers: Boolean(data.looking_for_players),
        lookingForCoach: Boolean(data.looking_for_coach),
        lookingForMusician: Boolean(data.looking_for_musician),
        description: data.description || null
    };
};

const convertDataToTeamMember = (data: { [key: string]: any }): TeamMember => {
    let confirmed = null;
    if (typeof data.confirmed === 'boolean') confirmed = data.confirmed;
    if (typeof data.confirmed === 'number') confirmed = Boolean(data.confirmed);
    return {
        team: data.team as string,
        name: data.name as string,
        id: data.id,
        role: data.role as Role,
        dateAdded: data.date_added as string,
        addedBy: data.added_by as string,
        confirmed
    };
};

export async function getTeam(id: string): Promise<Team | null> {
    const { data, error } = await supabaseAdmin
        .from('teams')
        .select('*')
        .eq('id', id)
        .maybeSingle();
    if (error) throw error;
    return data ? convertDataToTeam(data) : null;
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
        .ilike('theatres', `%${removeLeadingArticles(theatre)}%`);
    if (error) throw error;
    return (data || []).map(convertDataToTeam);
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
        .map(convertDataToTeam);
}

export async function getTeamMembershipsByUser(id: string): Promise<TeamMember[]> {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('id', id);
    if (error) throw error;
    if (!data?.length) return [];
    return (data || []).map(convertDataToTeamMember);
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
    return (data || []).map(convertDataToTeam);
}

export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('team', teamId);
    if (error) throw error;
    return (data || []).map(convertDataToTeamMember);
}

export async function getTeamInvitations(userId: string): Promise<TeamMember[]> {
    const { data, error } = await supabaseAdmin
        .from('team_members')
        .select('*')
        .eq('id', userId)
        .eq('confirmed', 0);
    if (error) throw error;
    return (data || []).map(convertDataToTeamMember);
}

export async function respondToTeamInvitation(teamId: string, userId: string, role: string, accept: boolean): Promise<void> {
    if (accept) {
        const { error } = await supabaseAdmin
            .from('team_members')
            .update({ confirmed: 1 })
            .eq('team', teamId)
            .eq('id', userId)
            .eq('role', role);
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
            theatres: team.theatres?.join(',') || null,
            looking_for_players: team.lookingForPlayers ? 1 : 0,
            looking_for_coach: team.lookingForCoach ? 1 : 0,
            looking_for_musician: team.lookingForMusician ? 1 : 0,
            description: team.description
        });
    if (teamInsertError) throw teamInsertError;

    const creator = (await getCurrentUser())?.id;
    const timestamp = new Date().toISOString();
    const memberRows = members.map(({ name, id, role }) => ({
        team: team.id,
        name,
        id,
        role,
        date_added: timestamp,
        added_by: creator,
        confirmed: id ? (id === creator ? 1 : 0) : null
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
    const data = prepDataForDb(updates);
    if (Object.keys(data).length) {
        const { error } = await supabaseAdmin
            .from('teams')
            .update(data)
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
        let confirmed: number | null = null;
        if (typeof existingMember?.confirmed === 'boolean') {
            confirmed = existingMember.confirmed ? 1 : 0;
        } else if (member.id) {
            confirmed = member.id === addedBy ? 1 : 0;
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
    const data = prepDataForDb(updates);
    if (!Object.keys(data).length) return true;
    const { error } = await supabaseAdmin
        .from('teams')
        .update(data)
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
        .eq('confirmed', 1);
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
