import Loader from "@/components/loader";
import OpenTeamsClient from "@/components/open-teams-client";
import { getOpenTeams } from "@/lib/teams";
import { Role, User } from "@/types";
import { Suspense } from "react";

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
        <Suspense fallback={<Loader />}>
            <OpenTeamsClient initialTeams={teams} role={role} />
        </Suspense>
    )
}