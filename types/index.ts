export interface Theatre {
    name: string;
    city: string;
    state: string;
    zipcode: string;
    website: string;
    image?: string;
}

export type Candence = '1' | '2' | '3' | '4' | '5' | '13' | '24' |'135' | '12345' | 'last';

export const CadenceText: Record<Candence, string> = {
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

export interface Event {
    id: string;
    creatorId: string;
    admins: string[];
    title: string;
    recurringDay: number | null;
    recurringTime: string | null;
    cadence: Candence | null;
    description: string | null;
    theatre: string | null;
    city: string | null;
    state: string | null;
    price: number | null;
    doorPrice: number | null;
    ticketsUrl: string | null;
    image: string | null;
    photoCredit: string | null;
    runtime: string | null;
    notes: string | null;
}

export interface Showing {
    eventId: string;
    dateTime: string;
    lookingForTeams?: boolean;
    lookingForPlayers?: boolean;
    lookingForDirectors?: boolean;
    lookingForMusician?: boolean;
    lookingForTech?: boolean;
}

export interface Team {
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
    role: Role | 'team';
    confirmed?: boolean | null;
}

export interface TeamMember extends CastMember {
    team: string;
    dateAdded: string;
    addedBy: string;
}

export interface ShowCastMember extends CastMember {
    showId: string;
    dateTime: string;
}

export interface User {
    id: string;
    password?: string;
    joinDate: string;
    firstName: string;
    lastName: string;
    pronouns?: string;
    headline?: string;
    bio?: string;
    theatres?: string[];
    city?: string;
    state?: string;
    website?: string;
    image?: string;
}

export type Followee = 'team' | 'theatre' | 'user';
export interface Follow {
    userId: string;
    followId: string;
    type: Followee;
    following: boolean;
}

export type InputOptionObject = { id: string | number, text: string, image?: string };
export type InputOption = string | InputOptionObject;