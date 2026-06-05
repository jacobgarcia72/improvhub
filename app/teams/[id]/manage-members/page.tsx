import CastingInputs from "@/components/form/casting-inputs";
import { getTeam } from "@/lib/teams";
import { getCurrentUser } from "@/lib/users";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>
}
export default async function TeamPage({ params }: Props) {
    const { id } = await params;
    // const members = await getTeamMembers(id);
    const currentUser = await getCurrentUser();
    const team = await getTeam(id);
    const isAdmin = currentUser && team?.admins.includes(currentUser.id);
    if (!isAdmin || !team) notFound();

    return <>
        <CastingInputs roles={['player', 'coach', 'musician']} />
    </>
}