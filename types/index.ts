export interface Event {
    id?: string;
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
    imageUrl?: string;
    teams?: Team[];
    performers?: Performer[];
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