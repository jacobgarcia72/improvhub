import { Follow, Followee, NewsFeedItem, NewsType } from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { camelCaseObject, snakeCaseObject } from "./helper-functions";
import { getStartOfToday } from "./dates";
import { getFriendIds, getUser } from "./users";

export const getNewsFeedItems = async (userId: string): Promise<NewsFeedItem[]> => {
    const { data } = await supabaseAdmin
        .from('follows')
        .select('*')
        .eq('user_id', userId);
    const follows: Follow[] = (data || []).map(camelCaseObject);
    
    const teamsFollowed = follows
        .filter((follow) => follow.type === 'team' && follow.following)
        .map((follow) => follow.followId);
    
    const theatresFollowed = follows
        .filter((follow) => follow.type === 'theatre' && follow.following)
        .map((follow) => follow.followId);
    
    const friendIds = await getFriendIds(userId);

    const user = await getUser(userId);
    const city = user?.city;
    const state = user?.state;

    const theatreIds = [...new Set(theatresFollowed.concat(user?.theatres || []))];

    const followQueries: string[] = [];

    if (friendIds.length) {
        followQueries.push(`and(follow_type.eq.user,follow_id.in.(${friendIds.join(',')}))`);
    }
    if (teamsFollowed.length) {
        followQueries.push(`and(follow_type.eq.team,follow_id.in.(${teamsFollowed.join(',')}))`);
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
        .gte('date', getStartOfToday());

    return (newsData || []) 
        .map(camelCaseObject)
        .sort((a: NewsFeedItem, b: NewsFeedItem) => b.date.localeCompare(a.date)) as NewsFeedItem[];
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