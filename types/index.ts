import { getRandomNumberString } from "@/lib/helper-functions";

export interface Theatre {
    id: string;
    name: string;
    address?: string;
    city: string;
    state: string;
    zipcode: string;
    website?: string;
    image?: string;
    admins?: string[];
}

export type Candence = '1' | '2' | '3' | '4' | '5' | '13' | '24' |'135' | '12345' | 'last';

export const CadenceText: { [cadence: string]: string } = {
    '1': 'First X of every month',
    '2': 'Second X of every month',
    '3': 'Third X of every month',
    '4': 'Fourth X of every month',
    '5': 'Fifth X of every month',
    '13': 'First and third X of every month',
    '24': 'Second and fourth X of every month',
    '135': 'Every odd X of the month',
    '12345': 'Xs',
    'last': 'Last X of every month'
}

export type EventType = 'show' | 'jam' | 'class' | 'workshop';
export const allEventTypes: EventType[] = ['show', 'jam', 'class', 'workshop'];
export type EventTypeFilter = EventType | 'all';

export interface Event {
    id: string;
    type?: EventType;
    creatorId: string;
    admins: string[];
    title: string;
    description: string | null;
    theatre: string | null;
    city: string | null;
    state: string | null;
    image: string | null;
    photoCredit: string | null;
    runtime: string | null;
    recurringDay?: number | null;
    recurringTime?: string | null;
    cadence?: Candence | null;
    price?: number | null;
    doorPrice?: number | null;
    ticketsUrl?: string | null;
    notes?: string | null;
    instructors?: string[] | null;
}

export interface EventOccurrence {
    eventId: string;
    dateTime: string;
    cancelled?: boolean;
}

export interface Showing extends EventOccurrence {
    lookingForTroupes?: boolean;
    lookingForPlayers?: boolean;
    lookingForDirectors?: boolean;
    lookingForMusician?: boolean;
    lookingForTech?: boolean;
}

export interface RsvpStatus {
    userId: string;
    showId: string;
    dateTime: string;
    rsvp: 'g' | 'n' | 'i' | null;
}

export interface Troupe {
    id: string;
    name: string;
    image: string | null;
    photoCredit: string | null;
    city: string | null;
    state: string | null;
    theatres: string[]; 
    lookingForPlayers: boolean;
    lookingForCoach: boolean;
    lookingForMusician: boolean;
    description: string | null;
}

export type Role = 'player' | 'coach' | 'musician' | 'director' | 'tech';

export interface CastMember {
    name: string;
    id: string | null;
    role: Role | 'troupe';
    confirmed?: boolean | null;
}

export interface TroupeMember extends CastMember {
    troupe: string;
    dateAdded: string;
    addedBy: string;
}

export interface ShowCastMember extends CastMember {
    showId: string;
    dateTime: string;
}

export interface User {
    id: string;
    uid?: string;
    joinDate: string;
    firstName: string;
    lastName: string;
    name?: string;
    pronouns?: string;
    bio?: string;
    theatres?: string[];
    city?: string;
    state?: string;
    website?: string;
    image?: string;
    openToJoinTroupe?: boolean;
    openToAccompanyTroupe?: boolean;
    openToCoachTroupe?: boolean;
}

export interface AbbrevUser { id: string, name: string, image?: string };

export type Followee = 'troupe' | 'theatre';
export interface Follow {
    userId: string;
    followId: string;
    type: Followee;
}

export interface Friendship {
    user1Id: string;
    user2Id: string;
    accepted: boolean;
}

export interface Topic {
    id: string;
    room: string;
    title: string;
    description: string | null;
    creator?: string;
    date?: string;
}

export interface DiscussionPost {
    id: string;
    room: string;
    topicId: string;
    post: string;
    creator: string;
    date: string;
}

export interface Comment {
    id: string;
    room: string;
    topicId: string;
    postId: string;
    comment: string;
    creator: string;
    date: string;
}

export type NewsType = (
    'new_theatre' |
    'new_show' | 
    'new_jam' | 
    'new_workshop' | 
    'new_class' | 
    'cast_in_show' | 
    'going_to_show' | 
    'going_to_jam' | 
    'going_to_workshop' | 
    'going_to_class' | 
    'new_troupe' | 
    'joined_troupe' |
    `instructor_for_jam` |
    `instructor_for_workshop` |
    `instructor_for_class`
);

export class NewsFeedItem {
    id: string;
    date: string;
    followType: Followee | 'city' | 'friend';
    followId: string;
    newsType: NewsType;
    newsItemId: string;
    newsItemDate: string | null;
    otherData: string | null;
    constructor(
        followType: Followee | 'city' | 'friend', 
        followId: string,
        newsType: NewsType,
        newsItemId: string,
        newsItemDate?: string | null,
        otherData?: string | null
    ) {
        this.date = new Date().toISOString();
        this.id = `${followType}-${followId}-${newsType}-${newsItemId}-${getRandomNumberString(10)}`;
        this.followType = followType;
        this.followId = followId;
        this.newsType = newsType;
        this.newsItemId = newsItemId;
        this.newsItemDate = newsItemDate || null;
        this.otherData = otherData || null;
    }
}

export type NotificationType = 
    'friend_request' |
    'friend_request_accept' |
    'added_to_troupe' |
    'confirmed_troupe' |
    'cast_in_show' |
    'show_drop_out' |
    'show_cancelled' |
    'jam_cancelled' |
    'workshop_cancelled' |
    'class_cancelled' |
    'show_occurrence_cancelled' |
    'jam_occurrence_cancelled' |
    'workshop_occurrence_cancelled' |
    'class_occurrence_cancelled' |
    'made_admin' |
    'made_instructor';

export type Notification = {
    id: string;
    date: string;
    sender: string;
    type: NotificationType;
    data: string | null;
}

export type InputOptionObject = { id: string | number, text: string, image?: string };
export type InputOption = string | InputOptionObject;
