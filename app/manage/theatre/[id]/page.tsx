import TheatreForm from "@/components/form/theatre-form";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";
import { appName } from '@/lib/app-info';
import { Metadata } from 'next';

export async function generateMetadata(
    { params }: {
    params: Promise<{ id: string }>
},
): Promise<Metadata> {
    const { id } = await params
    const theatre = await getTheatre(id);
    if (!theatre) return {};
    const { name, image } = theatre;
    const title = `${name} | ${appName}`;
    const metadata: Metadata = { title }
    if (image) {
        metadata.openGraph = {
            images: [{ url: image, alt: name }],
        }
    }
    return metadata;
}

type Props = {
    params: Promise<{ id: string }>
}

export default async function ManageTheatre({ params }: Props) {
    const { id } = await params;
    const theatre = await getTheatre(id);
    if (!theatre) notFound();

    const userId = await getCurrentUserId();
    const canManage = userId && (
        !theatre.admins?.length || theatre.admins.includes(userId)
    );
    if (!canManage) notFound();

    return (
        <TheatreForm theatre={theatre} userId={userId} />
    )
}
