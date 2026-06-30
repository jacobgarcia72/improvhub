import ShowForm from '@/components/form/show-form/show-form';
import { getShow } from '@/lib/shows';
import { getCurrentUserId } from '@/lib/users';
import { notFound } from 'next/navigation';
import { appName } from '@/lib/app-info';
import { Metadata } from 'next';

export async function generateMetadata(
    { params }: {
    params: Promise<{ id: string }>
},
): Promise<Metadata> {
    const { id } = await params
    const show = await getShow(id);
    if (!show) return {};
    const { title: name, description, image } = show;
    const title = `${name} | ${appName}`;
    const metadata: Metadata = { title, description }
    if (image) {
        metadata.openGraph = {
            images: [{ url: image, alt: name }],
        }
    }
    return metadata;
}

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