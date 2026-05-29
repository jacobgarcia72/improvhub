export interface Theatre {
    name: string;
    city: string;
    state: string;
    zipcode: string;
    website: string;
    logo?: string;
}

export type Candence = '1' | '2' | '3' | '4' | '5' | '13' | '24' |'135' | '12345' | 'last';

export type WeekdayInitial = 'u' | 'm' | 't' | 'w' | 'r' | 'f' | 's';

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
    title: string;
    dateTimes: string[] | null;
    recurringDay: WeekdayInitial | null;
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
    teams?: Team[] | null;
    performers?: User[] | null;
}

export interface Team {
    id: string;
    admins: string[];
    name: string;
    image: string | null;
    photoCredit: string | null;
    city: string | null;
    state: string | null;
    theatres: string[]; 
    players: string[];
    unconfirmedPlayers: string[];
    lookingForPlayers: boolean;
    coach: string | null;
    unconfirmedCoach: string | null;
    lookingForCoach: boolean;
    musician: string | null;
    unconfirmedMusician: string | null;
    lookingForMusician: boolean;
    description: string | null;
}

export interface User {
    id: string;
    password: string;
    joinDate: string;
    firstName: string;
    lastName?: string;
    pronouns?: string;
    headline?: string;
    bio?: string;
    theatres?: string[];
    city?: string;
    state?: string;
    gender?: string;
    orientation?: string;
    ethnicity?: string;
    website?: string;
    experience?: string;
    image?: string;
    teams?: number[] | string;
}

export type InputOption = string | { id: string | number, text: string, image?: string };