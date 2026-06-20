import { getAllTheatres, getTheatresByCity, getTheatresByState } from '@/lib/theatres';
import { InputOptionObject, Theatre } from '@/types';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const cityParam = url.searchParams.get('city') as string | undefined;
    const stateParam = url.searchParams.get('state') as string | undefined;
    const milesParam = url.searchParams.get('miles') as string | undefined;
    try {
        let theatres: (InputOptionObject | Theatre)[] = [];
        if (cityParam && stateParam) {
            theatres = await getTheatresByCity(cityParam, stateParam, Number(milesParam || 0));
        } else if (stateParam) {
            theatres = await getTheatresByState(stateParam);
        } else {
            theatres = await getAllTheatres();
        }
        return NextResponse.json(theatres, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Failed to load theatres:', error);
        return NextResponse.json([], { status: 500 });
    }
}
