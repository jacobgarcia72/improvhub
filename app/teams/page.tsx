import Link from "next/link";
import TeamInvitations from "./team-invitations";
import Button from "@/components/form/button";
import TeamsSection from "./teams-section";
import { getCurrentUser } from "@/lib/users";
import { getTeamMembershipsByUser } from "@/lib/teams";
import OpenTeamsSection from "./open-teams-section";
import AvailableUsersSection from "./available-users-section";
import { appName } from '@/lib/app-info';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Improv Teams | ${appName}`
};

export default async function TeamsPage() {
    const user = await getCurrentUser();
    const teamMemberships = user ? await getTeamMembershipsByUser(user.id) : [];
    return <>
        <TeamInvitations />
        <section className="flex flex row gap-2">
            <Link href="/create/team">
                <Button caption="New Team" />
            </Link>
            <Link href="/search?for=teams">
                <Button caption="Find Teams" />
            </Link>
        </section>
        {user ? <>
            <TeamsSection teamMemberships={teamMemberships} header="My Teams" roles={['player', 'musician']} />
            <TeamsSection teamMemberships={teamMemberships} header="Teams I Coach" roles={['coach']} />
            {user.openToJoinTeam ? <AvailableUsersSection role="player" /> : null}
            {user.openToJoinTeam ? <OpenTeamsSection role="player" user={user} /> : null}
            {user.openToAccompanyTeam ? <OpenTeamsSection role="musician" user={user} /> : null}
            {user.openToCoachTeam ? <OpenTeamsSection role="coach" user={user} /> : null}
        </> : (
            <section className="min-h-32 flex flex-col items-center justify-center gap-2">
                <p className="mb-2"><Link className="link" href="/login">Sign in</Link> to create, manage, and follow improv teams!</p>
            </section>
        )}
    </>
}