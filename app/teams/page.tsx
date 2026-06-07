import Link from "next/link";
import TeamInvitations from "./team-invitations";
import Button from "@/components/form/button";
import TeamsSection from "./teams-section";
import { getCurrentUser } from "@/lib/users";
import { getTeamMembershipsByUser } from "@/lib/teams";

export default async function TeamsPage() {
    const user = await getCurrentUser();
    if (!user) return null;
    const teamMemberships = await getTeamMembershipsByUser(user.id);
    return <>
        <TeamInvitations />
        <TeamsSection teamMemberships={teamMemberships} header="My Teams" roles={['player', 'musician']} />
        <TeamsSection teamMemberships={teamMemberships} header="Teams I Coach" roles={['coach']} />
        <section className="flex flex row gap-2">
            <Link href="/create/team">
                <Button caption="New Team" />
            </Link>
            <Link href="/search?for=teams">
                <Button caption="Find Teams" />
            </Link>
        </section>
    </>
}