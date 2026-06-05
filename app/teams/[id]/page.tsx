import { getTeamMembers } from "@/lib/teams";
import CastList from "@/components/cast-list";
import { getCurrentUser } from "@/lib/users";
import Link from "next/link";
import Button from "@/components/form/button";

type Props = {
    params: Promise<{ id: string }>
}
export default async function TeamPage({ params }: Props) {
    const { id } = await params;
    const members = await getTeamMembers(id);
    const currentUser = await getCurrentUser();
    const isMember = currentUser && members.find((member) => member.id === currentUser.id);

    return <>
        {isMember ? (
            <Link className="ml-4 mb-1" href={`/teams/${id}/manage-members`}>
                <Button caption="Manage Members" />
            </Link>
        ) : null}
        <CastList castMembers={members} />
    </>
}