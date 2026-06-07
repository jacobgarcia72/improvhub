import Link from "next/link";
import MyTeams from "./my-teams";
import TeamInvitations from "./team-invitations";
import Button from "@/components/form/button";

export default function TeamsPage() {
    return <>
        <TeamInvitations />
        <MyTeams />
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