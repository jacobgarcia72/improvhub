import Link from "next/link";
import TeamInvitations from "./team-invitations";
import Button from "@/components/form/button";
import TeamsSection from "./teams-section";

export default function TeamsPage() {
    return <>
        <TeamInvitations />
        <TeamsSection header="My Teams" roles={['player', 'musician']} />
        <TeamsSection header="Teams I Coach" roles={['coach']} />
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