import EventForm from '@/components/form/event-form/event-form';
import { getEvent } from '@/lib/shows';
import { getCurrentUserId } from '@/lib/users';
import { notFound } from 'next/navigation';
import { appName } from '@/lib/app-info';
import { Metadata } from 'next';
import { EventType } from '@/types';

export async function generateMetadata(
    { params }: {
    params: Promise<{ id: string, event: string }>
},
): Promise<Metadata> {
    const { event: type, id } = await params;
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        return {};
    }
    const event = await getEvent(id, type as EventType);
    if (!event) return {};
    const { title: name, description, image } = event;
    const title = `${name} | ${appName}`;
    const metadata: Metadata = { title, description }
    if (image) {
        metadata.openGraph = {
            images: [{ url: image, alt: name }],
        }
    }
    return metadata;
}

export default async function ManageEventPage({ params }: { params: Promise<{ event: string, id: string }> }) {
    const { event: type, id } = await params;
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    const event = await getEvent(id, type as EventType);
    if (!event) notFound();

    const userId = await getCurrentUserId();
    const isAdmin = userId && event?.admins.includes(userId);
    if (!isAdmin) notFound();

    return <EventForm existingEvent={event} type={type as EventType} />
}