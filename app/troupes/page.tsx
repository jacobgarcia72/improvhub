import Link from "next/link";
import TroupeInvitations from "./troupe-invitations";
import Button from "@/components/form/button";
import TroupesSection from "./troupes-section";
import { getCurrentUser } from "@/lib/users";
import { getTroupeMembershipsByUser } from "@/lib/troupes";
import OpenTroupesSection from "./open-troupes-section";
import AvailableUsersSection from "./available-users-section";
import { appName } from '@/lib/app-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Improv Troupes | ${appName}`
};

export default async function TroupesPage() {
    const user = await getCurrentUser();
    const troupeMemberships = user ? await getTroupeMembershipsByUser(user.id) : [];
    return <>
        <TroupeInvitations />
        <section className="flex flex row gap-2">
            <Link href="/create/troupe">
                <Button caption="New Troupe" />
            </Link>
            <Link href="/search?for=troupes">
                <Button caption="Find Troupes" />
            </Link>
        </section>
        {user ? <>
            <TroupesSection troupeMemberships={troupeMemberships} header="My Troupes" roles={['player', 'musician']} />
            <TroupesSection troupeMemberships={troupeMemberships} header="Troupes I Coach" roles={['coach']} />
            {user.openToJoinTroupe ? <AvailableUsersSection role="player" /> : null}
            {user.openToJoinTroupe ? <OpenTroupesSection role="player" user={user} /> : null}
            {user.openToAccompanyTroupe ? <OpenTroupesSection role="musician" user={user} /> : null}
            {user.openToCoachTroupe ? <OpenTroupesSection role="coach" user={user} /> : null}
        </> : (
            <section className="min-h-32 flex flex-col items-center justify-center gap-2">
                <p className="mb-2"><Link className="link" href="/login">Sign in</Link> to create, manage, and follow improv troupes!</p>
            </section>
        )}
    </>
}