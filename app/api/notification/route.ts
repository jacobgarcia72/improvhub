import { deleteNotification } from '@/lib/notifications';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
    revalidatePath('/notifications');
    return NextResponse.json({ revalidated: true }, { status: 200 });
}

export async function DELETE(req: Request) {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: 'Missing notification id' }, { status: 400 });
    }

    try {
        const notif = await deleteNotification(id);
        revalidatePath('/notifications');
        return NextResponse.json(notif, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Failed to delete notification:', error);
        return NextResponse.json([], { status: 500 });
    }
}
