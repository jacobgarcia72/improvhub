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

export interface Event {
    id: string;
    creatorId: string;
    title: string;
    dates: string | null;
    times: string | null;
    recurringDay: WeekdayInitial | null;
    cadence: Candence | null;
    description: string | null;
    theatre: string | null;
    zipcode: string | null;
    price: number | null;
    doorPrice: number | null;
    webpage: string | null;
    image: string | null;
    teams?: Team[] | null;
    performers?: User[] | null;
}

interface Team {
    id: string;
    name: string;
    performers: string[];
    description: string;
}

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName?: string;
    pronouns?: string;
    headline?: string;
    bio?: string;
    theatre?: string;
    secondaryTheatre?: string;
    gender?: string;
    orientation?: string;
    ethnicity?: string;
    website?: string;
    experience?: string;
    image?: string;
    teams?: number[] | string;
}