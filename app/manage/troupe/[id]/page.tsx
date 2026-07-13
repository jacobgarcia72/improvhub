import TroupeForm from "@/components/form/troupe-form";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
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
    const troupe = await getTroupe(id);
    if (!troupe) return {};
    const { name, description, image } = troupe;
    const title = `${name} | ${appName}`;
    const metadata: Metadata = { title, description }
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

export default async function ManageTroupe({ params }: Props) {
    const { id } = await params;
    const troupe = await getTroupe(id);
    if (!troupe) notFound();

    const userId = await getCurrentUserId();
    const members = await getTroupeMembers(id);
    const canManageTroupe = userId && members.some((member) => (
        member.id === userId &&
        member.confirmed &&
        member.role !== 'coach'
    ));
    if (!canManageTroupe) notFound();

    return (
        <TroupeForm troupe={troupe} />
    )
}
