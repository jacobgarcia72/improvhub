export interface EventFormData {
    title: string;
    type: 'show' | 'jam' | 'class';
    date: string;
    time: string;
    description?: string;
    theatre?: string;
    address: string;
    price?: number;
    doorPrice?: number;
    webpage?: string;
    image?: File;
    imageUrl?: string;
    teams?: Team[];
    performers?: Performer[];
}

export interface Event extends EventFormData {
    id: string;
}

interface Team {
    id: string;
    name: string;
    performers: string[];
    description: string;
}

interface Performer {
    id: string;
    name: string;
    teams: string[];
}