import TeamForm from "@/components/form/team-form";
import { getTeam, getTeamMembers } from "@/lib/teams";
import { getCurrentUser } from "@/lib/users";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>
}

export default async function ManageTeam({ params }: Props) {
    const { id } = await params;
    const team = await getTeam(id);
    if (!team) notFound();

    const currentUser = await getCurrentUser();
    const members = await getTeamMembers(id);
    const canManageTeam = currentUser && members.some((member) => (
        member.id === currentUser.id &&
        member.confirmed &&
        member.role !== 'coach'
    ));
    if (!canManageTeam) notFound();

    return (
        <TeamForm team={team} />
    )
}
