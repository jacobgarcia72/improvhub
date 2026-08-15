import { canDeleteTheatre, deleteTheatre, getTheatre } from '@/lib/theatres';
import { getCurrentUserId } from '@/lib/users';
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

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const idParam = url.searchParams.get('id') as string;
    if (!idParam) return NextResponse.json({ message: 'Theatre id is required' }, { status: 400 });

    try {
        const userId = await getCurrentUserId();
        if (!userId) return NextResponse.json({ message: 'You must be logged in to continue' }, { status: 401 });

        const theatre = await getTheatre(idParam);
        if (!theatre) return NextResponse.json({ message: 'Theatre not found' }, { status: 404 });
        if (!canDeleteTheatre(theatre, userId)) {
            return NextResponse.json({ message: 'You do not have permission to delete this theatre' }, { status: 403 });
        }

        await deleteTheatre(idParam);
        return NextResponse.json({ success: true }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Failed to delete theatre:', error);
        return NextResponse.json([], { status: 500 });
    }
}

