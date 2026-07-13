import Loader from "@/components/loader";
import OpenTroupesClient from "@/components/open-troupes-client";
import { getOpenTroupes } from "@/lib/troupes";
import { Role, User } from "@/types";
import { Suspense } from "react";

export default async function OpenTroupesSection({
    role,
    user
} : {
    role: Role,
    user: User
}) {
    const troupes = await getOpenTroupes(user, role)
    if (!troupes?.length) return null;
    return (
        <Suspense fallback={<Loader />}>
            <OpenTroupesClient initialTroupes={troupes} role={role} />
        </Suspense>
    )
}