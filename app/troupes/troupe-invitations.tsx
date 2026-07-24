import { getTroupeInvitations } from "@/lib/troupes"
import { getCurrentUserId } from "@/lib/users"
import TroupeInvitation from "./troupe-invitation";

export default async function TroupeInvitations() {
    const userId = await getCurrentUserId();
    if (!userId) return null;
    const invitations = await getTroupeInvitations(userId);
    if (!invitations.length) return null;
    return (
        invitations.map((invite, i) => <TroupeInvitation key={i} troupeMembership={invite} />)
    )
}