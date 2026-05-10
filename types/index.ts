export interface Theatre {
    name: string;
    city: string;
    state: string;
    zipcode: string;
    website: string;
    logo?: string;
}

export interface EventFormData {
    title: string;
    type: 'show' | 'jam' | 'class';
    date?: string;
    time?: string;
    description?: string;
    theatre?: string;
    zipcode?: string;
    price?: number;
    doorPrice?: number;
    webpage?: string;
    image?: File;
    imageUrl?: string;
    teams?: Team[];
    performers?: User[];
}

export interface Event extends EventFormData {
    id: string;
    creatorId: string;
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