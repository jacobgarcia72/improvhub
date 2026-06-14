import UserSuggestionsClient from "@/components/user-suggestions-client";
import { getSuggestionsForTeam } from "@/lib/teams";
import { Role, Team } from "@/types";

export default async function AvailableUsersSection({
    role,
    team
} : {
    role: Role,
    team?: Team
}) {
    const users = await getSuggestionsForTeam(role, team);
    if (!users?.length) return null;
    return (
        <UserSuggestionsClient initialUsers={users} role={role} teamId={team?.id} />
    )
}