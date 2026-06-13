import OpenTeamsClient from "@/components/open-teams-client";
import { getOpenTeams } from "@/lib/teams";
import { Role, User } from "@/types";

export default async function OpenTeamsSection({
    role,
    user
} : {
    role: Role,
    user: User
}) {
    const teams = await getOpenTeams(user, role)
    if (!teams?.length) return null;
    return (
        <OpenTeamsClient initialTeams={teams} role={role} />
    )
}