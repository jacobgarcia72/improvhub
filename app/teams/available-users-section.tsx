import Loader from "@/components/loader";
import UserSuggestionsClient from "@/components/user-suggestions-client";
import { getSuggestionsForTeam } from "@/lib/teams";
import { Role, Team } from "@/types";
import { Suspense } from "react";

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
        <Suspense fallback={<Loader />}>
            <UserSuggestionsClient initialUsers={users} role={role} teamId={team?.id} />
        </Suspense>
    )
}