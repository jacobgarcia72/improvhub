import { getTeamInvitations } from "@/lib/teams"
import { getCurrentUserId } from "@/lib/users"
import TeamInvitation from "./team-invitation";

export default async function TeamInvitations() {
    const userId = await getCurrentUserId();
    if (!userId) return null;
    const invitations = await getTeamInvitations(userId);
    if (!invitations.length) return null;
    return (
        <section>
            <h2 className="px-3 pb-2">Invitations</h2>
            {invitations.map((invite, i) => <TeamInvitation key={i} teamMembership={invite} />)}
        </section>
    )
}