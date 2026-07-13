import Loader from "@/components/loader";
import MiniCard from "@/components/mini-card";
import { getTroupe } from "@/lib/troupes";
import { Role, TroupeMember } from "@/types";
import { Suspense } from "react";

export default async function TroupesSection({
    roles, header, troupeMemberships
} : {
    roles: Role[],
    header: string,
    troupeMemberships: TroupeMember[]
}) {
    const membershipsByRoles = troupeMemberships.filter(
        (m) => roles.includes(m.role as Role) && m.confirmed
    );
    const uniqueTroupes = [...new Map(membershipsByRoles.map((m) => [m.troupe, m])).values()];
    const troupes = (await Promise.all(
        uniqueTroupes.map((m) => getTroupe(m.troupe))
    )).filter((troupe) => troupe !== null)

    if (!troupes?.length) return null;
    return (
        <Suspense fallback={<Loader />}>
            <section>
                <h2 className="px-3">{header}</h2>
                <div className="flex flex-row flex-wrap">
                    {troupes.map((troupe, i) => <MiniCard key={i} item={troupe} type="troupe" />)}
                </div>
            </section>
        </Suspense>
    )
}