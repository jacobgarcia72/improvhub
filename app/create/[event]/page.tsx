import Event from '@/components/form/event-form/event-form';
import { EventType } from '@/types';
import { notFound } from 'next/navigation';

export default async function NewEventPage({ params }: { params: Promise<{ event: string }> }) {
    const { event } = await params;
    if (!['show', 'jam', 'class', 'workshop'].includes(event)) {
        notFound();
    }
    return <Event type={event as EventType} />
}