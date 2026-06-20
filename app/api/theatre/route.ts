import { getTheatre } from '@/lib/theatres';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const idOrNameParam = url.searchParams.get('idOrName') as string;
    try {
        const theatre = await getTheatre(idOrNameParam);
        return NextResponse.json(theatre, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Failed to load theatre:', error);
        return NextResponse.json([], { status: 500 });
    }
}
