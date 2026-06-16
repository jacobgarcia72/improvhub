import ShowForm from '@/components/form/show-form/show-form';
import { getShow } from '@/lib/shows';
import { getCurrentUserId } from '@/lib/users';
import { notFound } from 'next/navigation';

export default async function ManageShowPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const show = await getShow(id);
    if (!show) notFound();

    const userId = await getCurrentUserId();
    const isAdmin = userId && show?.admins.includes(userId);
    if (!isAdmin) notFound();

    return <ShowForm existingShow={show} />
}