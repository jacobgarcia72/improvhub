import { getTeam, getTeamMembers } from "@/lib/teams";
import CastList from "@/components/cast-list";
import { getCurrentUserId, getFollowCount } from "@/lib/users";
import Link from "next/link";
import Button from "@/components/form/button";
import { pluralize } from "@/lib/helper-functions";
import AvailableUsersSection from "../available-users-section";
import UpcomingShows from "@/components/upcoming-shows";

type Props = {
    params: Promise<{ id: string }>
}
export default async function TeamPage({ params }: Props) {
    const { id } = await params;
    const members = await getTeamMembers(id);
    const currentUserId = await getCurrentUserId();
    const isMemberNotCoach = currentUserId && members.some(
        (member) => member.id === currentUserId && member.confirmed && member.role !== 'coach'
    );
    const followerCount = await getFollowCount(id, 'team');
    const team = await getTeam(id);

    return <>
        {followerCount ? (
            <section>
                <Link href={`/teams/${id}/followers`} className="link ml-8">
                    {`${followerCount} ${pluralize('Follower', followerCount)}`}
                </Link>
            </section>
        ) : null}
        <section>
            {isMemberNotCoach ? <>
                <div className="flex flex-row gap-2 justify-center mb-2">
                    <Link href={`/teams/${id}/manage-members`}>
                        <Button caption="Manage Members" className="w-54" />
                    </Link>
                    <Link href={`/manage/team/${id}`}>
                        <Button caption="Manage Team Details" className="w-54" />
                    </Link>
                </div>
            </> : null}
            <CastList castMembers={members} />
        </section>
        <UpcomingShows id={id} roles={['team']} limit={6} />
        {isMemberNotCoach ? <>
            {team?.lookingForPlayers && <AvailableUsersSection role="player" team={team} />}
            {team?.lookingForMusician && <AvailableUsersSection role="musician" team={team} />}
            {team?.lookingForCoach && <AvailableUsersSection role="coach" team={team} />}
        </> : null}
    </>
}