import { updateTroupe } from "@/actions";
import CastingInputs from "@/components/form/casting-inputs";
import Form from "@/components/form/form";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>
}
export default async function TroupeManagePage({ params }: Props) {
    const { id } = await params;
    const members = await getTroupeMembers(id, true);
    const userId = await getCurrentUserId();
    const troupe = await getTroupe(id);
    const isMemberNotCoach = userId && members.some(
        (member) => member.id === userId && member.confirmed && member.role !== 'coach'
    );
    if (!isMemberNotCoach || !troupe) notFound();

    async function cancel() {
        'use server';
        redirect(`/troupes/${id}`);
    }

    const { lookingForPlayers, lookingForCoach, lookingForMusician } = troupe;
    return <section>
        <Form onSubmit={updateTroupe.bind(null, id)} cancel={cancel}>
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
