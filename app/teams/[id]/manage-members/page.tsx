import { updateTeam } from "@/actions";
import CastingInputs from "@/components/form/casting-inputs";
import Form from "@/components/form/form";
import { getTeam, getTeamMembers } from "@/lib/teams";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>
}
export default async function TeamManagePage({ params }: Props) {
    const { id } = await params;
    const members = await getTeamMembers(id);
    const userId = await getCurrentUserId();
    const team = await getTeam(id);
    const isMemberNotCoach = userId && members.some(
        (member) => member.id === userId && member.confirmed && member.role !== 'coach'
    );
    if (!isMemberNotCoach || !team) notFound();

    async function cancel() {
        'use server';
        redirect(`/teams/${id}`);
    }

    const { lookingForPlayers, lookingForCoach, lookingForMusician } = team;
    return <section>
        <Form onSubmit={updateTeam.bind(null, id)} cancel={cancel}>
            <CastingInputs
                roles={['player', 'coach', 'musician']}
                currentCast={members}
                lookingFors={{
                    lookingForPlayers,
                    lookingForCoach,
                    lookingForMusician
                }}
            />
        </Form>
    </section>
}
