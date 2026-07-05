import { Follow, Followee, NewsFeedItem, NewsType } from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { camelCaseObject, snakeCaseObject } from "./helper-functions";
import { getFriendIds, getUser } from "./users";
import { getTeamsByUser } from "./teams";

export const getNewsFeedItems = async (userId: string): Promise<NewsFeedItem[]> => {
    const { data } = await supabaseAdmin
        .from('follows')
        .select('*')
        .eq('user_id', userId);
    const follows: Follow[] = (data || []).map(camelCaseObject);
    
    const teamsFollowed = follows
        .filter((follow) => follow.type === 'team')
        .map((follow) => follow.followId);
    
    const theatresFollowed = follows
        .filter((follow) => follow.type === 'theatre')
        .map((follow) => follow.followId);
    
    const friendIds = await getFriendIds(userId);

    const user = await getUser(userId);
    const city = user?.city;
    const state = user?.state;

    const userTeams = (await getTeamsByUser(userId)).map((team) => team.id);
    const teamIds = [...new Set(teamsFollowed.concat(userTeams))];

    const theatreIds = [...new Set(theatresFollowed.concat(user?.theatres || []))];

    const followQueries: string[] = [];

    followQueries.push(`and(follow_type.eq.friend,follow_id.in.(${[...friendIds, userId].join(',')}))`);
    if (teamIds.length) {
        followQueries.push(`and(follow_type.eq.team,follow_id.in.(${teamIds.join(',')}))`);
    }
    if (theatreIds.length) {
        followQueries.push(`and(follow_type.eq.theatre,follow_id.in.(${theatreIds.join(',')}))`);
    }
    if (city && state) {
        followQueries.push(`and(follow_type.eq.city,follow_id.ilike.${`${city} ${state}`})`);
    }
    if (!followQueries.length) {
        return [];
    }
    const { data: newsData } = await supabaseAdmin
        .from('news')
        .select('*')
        .or(followQueries.join(','))
        .order('date', { ascending: false })
        .limit(100)

    return (newsData || []) 
        .map(camelCaseObject) as NewsFeedItem[];
}

export const createNewsFeedItem = async (followType: Followee | 'city' | 'friend', followId: string, newsType: NewsType, newsItemId: string, newsItemDate?: string | null, otherData?: string | null): Promise<void> => {
    const newsFeedItem = new NewsFeedItem(followType, followId, newsType, newsItemId, newsItemDate, otherData || null);
    await supabaseAdmin
        .from('news')
        .insert(snakeCaseObject(newsFeedItem));
}

export const deleteNewsFeedItem = async (followType: Followee | 'city' | 'friend', followId: string, newsType: NewsType, newsItemId: string, newsItemDate?: string | null, otherData?: string | null): Promise<void> => {
    await supabaseAdmin
        .from('news')
        .delete()
        .eq('follow_type', followType)
        .eq('follow_id', followId)
        .eq('news_type', newsType)
        .eq('news_item_id', newsItemId)
        .eq('news_item_date', newsItemDate || null)
        .eq('other_data', otherData || null);
}