import TeamForm from "@/components/form/team-form";
import { getTeam, getTeamMembers } from "@/lib/teams";
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
    const team = await getTeam(id);
    if (!team) return {};
    const { name, description, image } = team;
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

export default async function ManageTeam({ params }: Props) {
    const { id } = await params;
    const team = await getTeam(id);
    if (!team) notFound();

    const userId = await getCurrentUserId();
    const members = await getTeamMembers(id);
    const canManageTeam = userId && members.some((member) => (
        member.id === userId &&
        member.confirmed &&
        member.role !== 'coach'
    ));
    if (!canManageTeam) notFound();

    return (
        <TeamForm team={team} />
    )
}
