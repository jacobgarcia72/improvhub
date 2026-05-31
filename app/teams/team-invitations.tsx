import { getTeamInvitations } from "@/lib/teams"
import { getCurrentUser } from "@/lib/users"

export default async function TeamInvitations() {
    const user = await getCurrentUser();
    if (!user) return null;
    const invitations = await getTeamInvitations(user.id);
    return (
        <section>
            {invitations.map((invite) => invite.team)}
        </section>
    )
}