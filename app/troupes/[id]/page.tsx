import { getTroupe, getTroupeMembers } from "@/lib/troupes";
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
export default async function TroupePage({ params }: Props) {
    const { id } = await params;
    const members = await getTroupeMembers(id, true);
    const currentUserId = await getCurrentUserId();
    const isMemberNotCoach = currentUserId && members.some(
        (member) => member.id === currentUserId && member.confirmed && member.role !== 'coach'
    );
    const followerCount = await getFollowCount(id, 'troupe');
    const troupe = await getTroupe(id);

    return <>
        {followerCount ? (
            <section>
                <Link href={`/troupes/${id}/followers`} className="link ml-8">
                    {`${followerCount} ${pluralize('Follower', followerCount)}`}
                </Link>
            </section>
        ) : null}
        <section>
            {isMemberNotCoach ? <>
                <div className="flex flex-row gap-2 justify-center mb-2">
                    <Link href={`/troupes/${id}/manage-members`}>
                        <Button caption="Manage Members" className="w-54 max-w-[45vw] px-0!" />
                    </Link>
                    <Link href={`/manage/troupe/${id}`}>
                        <Button caption="Manage Troupe Details" className="w-54 max-w-[45vw] px-0!" />
                    </Link>
                </div>
            </> : null}
            <CastList castMembers={members} />
        </section>
        <UpcomingShows id={id} roles={['troupe']} limit={6} />
        {isMemberNotCoach ? <>
            {troupe?.lookingForPlayers && <AvailableUsersSection role="player" troupe={troupe} />}
            {troupe?.lookingForMusician && <AvailableUsersSection role="musician" troupe={troupe} />}
            {troupe?.lookingForCoach && <AvailableUsersSection role="coach" troupe={troupe} />}
        </> : null}
    </>
}