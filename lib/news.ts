import { Follow, NewsFeedItem } from "@/types";
import { supabaseAdmin } from "./supabase-server";
import { camelCaseObject, snakeCaseObject } from "./helper-functions";
import { getStartOfToday } from "./dates";

export const getNewsFeedItems = async (userId: string): Promise<NewsFeedItem[]> => {
    const { data } = await supabaseAdmin
        .from('follows')
        .select('*')
        .eq('user_id', userId);
    const follows: Follow[] = (data || []).map(camelCaseObject);
    
    const usersFollowed = follows
        .filter((follow) => follow.type === 'user' && follow.following)
        .map((follow) => follow.followId);
    
    const teamsFollowed = follows
        .filter((follow) => follow.type === 'team' && follow.following)
        .map((follow) => follow.followId);
    
    const theatresFollowed = follows
        .filter((follow) => follow.type === 'theatre' && follow.following)
        .map((follow) => follow.followId);

    const { data: newsData } = await supabaseAdmin
        .from('news')
        .select('*')
        .or(`and(follow_type.eq.user,follow_id.in.(${usersFollowed.join(',')})),and(follow_type.eq.team,follow_id.in.(${teamsFollowed.join(',')})),and(follow_type.eq.theatre,follow_id.in.(${theatresFollowed.join(',')}))`)
        .gte('date', getStartOfToday());

    return (newsData || [])
        .map(camelCaseObject)
        .sort((a: NewsFeedItem, b: NewsFeedItem) => b.date.localeCompare(a.date)) as NewsFeedItem[];
}

export const createNewsFeedItem = async (newsFeedItem: NewsFeedItem): Promise<void> => {
    await supabaseAdmin
        .from('news')
        .insert(snakeCaseObject(newsFeedItem));
}