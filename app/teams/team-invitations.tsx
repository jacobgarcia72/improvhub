import { getTeamInvitations } from "@/lib/teams"
import { getCurrentUser } from "@/lib/users"
import TeamInvitation from "./team-invitation";

export default async function TeamInvitations() {
    const user = await getCurrentUser();
    if (!user) return null;
    const invitations = await getTeamInvitations(user.id);
    if (!invitations.length) return null;
    return (
        <section>
            <h2 className="px-3 pb-2">Invitations</h2>
            {invitations.map((invite, i) => <TeamInvitation key={i} teamMembership={invite} />)}
        </section>
    )
}