export interface Theatre {
    name: string;
    city: string;
    state: string;
    zipcode: string;
    website: string;
    logo?: string;
}

export interface Event {
    id: string;
    creatorId: string;
    title: string;
    dates?: string;
    times?: string;
    description?: string;
    theatre?: string;
    zipcode?: string;
    price?: number;
    doorPrice?: number;
    webpage?: string;
    image?: string;
    teams?: Team[];
    performers?: User[];
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