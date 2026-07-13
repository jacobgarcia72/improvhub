import Loader from "@/components/loader";
import UserSuggestionsClient from "@/components/user-suggestions-client";
import { getSuggestionsForTroupe } from "@/lib/troupes";
import { Role, Troupe } from "@/types";
import { Suspense } from "react";

export default async function AvailableUsersSection({
    role,
    troupe
} : {
    role: Role,
    troupe?: Troupe
}) {
    const users = await getSuggestionsForTroupe(role, troupe);
    if (!users?.length) return null;
    return (
        <Suspense fallback={<Loader />}>
            <UserSuggestionsClient initialUsers={users} role={role} troupeId={troupe?.id} />
        </Suspense>
    )
}