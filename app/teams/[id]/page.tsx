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
    const isMemberNotCoach = currentUser && members.some(
        (member) => member.id === currentUser.id && member.confirmed && member.role !== 'coach'
    );

    return <>
        {isMemberNotCoach ? (
            <div className="flex flex-row gap-2 justify-center mb-2">
                <Link href={`/teams/${id}/manage-members`}>
                    <Button caption="Manage Members" />
                </Link>
                <Link href={`/manage/team/${id}`}>
                    <Button caption="Manage Team Details" />
                </Link>
            </div>
        ) : null}
        <CastList castMembers={members} />
    </>
}