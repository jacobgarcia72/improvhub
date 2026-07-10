import { optimizeImage } from "@/lib/optimize-image";
import { getFriendship, getUser, getUserAbbreviated } from "@/lib/users";
import { Notification, Role } from "@/types";
import Image from "next/image";
import Link from "next/link";
import FriendRequestButtons from "./friend-request-buttons";
import { getTeam, getTeamMembership } from "@/lib/teams";
import { getPronounForm } from "@/lib/demographics";
import TeamRequestButtons from "./team-request-buttons";

function Wrapper({ children, image, imageLink, imageAlt }: { children: React.ReactNode, image?: string | null, imageLink: string, imageAlt: string }) {
    return (
        <div className="border-b border-b-black/20 px-2 pb-3">
            <div className="flex flex-row gap-2 items-start">
                {image ? <Link href={imageLink}>
                    <Image
                        src={optimizeImage(image, 100, 100, 90, true)}
                        alt={imageAlt} width={50} height={50}
                        className="rounded"
                    />
                </Link> : null}
                {children}
            </div>
        </div>
    )
}

export default async function NotificationCard({ notification, userId }: { notification: Notification, userId: string }) {
    const { type, sender: senderId, id: notifId, data } = notification;
    const sender = await getUserAbbreviated(senderId);
    if (!sender) return null;
    let innerContent: React.ReactNode;
    switch (type) {
        case 'friend_request':
            const friendship = await getFriendship(userId, senderId);
            if (friendship === null) {
                return null;
            } else if (friendship?.accepted) {
                innerContent = (
                    <p>
                        You and&nbsp;
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender.name}
                        </Link>
                        &nbsp;are now friends!
                    </p>
                )
            } else {
                innerContent = (
                    <div className="flex flex-col gap-1">
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender.name}
                            </Link>
                            &nbsp;sent you a friend request!
                        </p>
                        <FriendRequestButtons yourId={userId} thierId={senderId} notifId={notifId} />
                    </div>
                )
            }
            return (
                <Wrapper image={sender.image} imageLink={`/profile/${senderId}`} imageAlt={sender.name}>
                    {innerContent}
                </Wrapper>
            )
        case 'friend_request_accept':
            return (
                <Wrapper image={sender.image} imageLink={`/profile/${senderId}`} imageAlt={sender.name}>
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender.name}
                            </Link>
                            &nbsp;accepted your friend request!
                        </p>
                </Wrapper>
            )
        case 'added_to_team':
            if (!data) return null;
            const [teamId, role] = data.split(',');
            const team = await getTeam(teamId);
            const pronouns = (await getUser(senderId))?.pronouns;
            const membership = await getTeamMembership(userId, teamId, role as Role);
            if (!team || !membership) return null;
            let verb = 'join';
            if (role === 'coach') {
                verb = 'coach';
            } else if (role === 'musician') {
                verb = 'musically accompany';
            }
            const hasConfirmed = membership.confirmed;
            if (hasConfirmed) {
                innerContent = (
                    <p>
                        You accepted&nbsp;
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender.name}
                        </Link>
                        &apos;s invitation to {verb} &nbsp;
                        <Link href={`/teams/${team.id}`} className="link">
                            {team.name}
                        </Link>!
                    </p>
                )
            } else {
                innerContent = (
                    <div className="flex flex-col gap-1">
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender.name}
                            </Link>
                            &nbsp;has invited you to&nbsp;{verb}&nbsp;{getPronounForm(pronouns, 2)}&nbsp;team,&nbsp;
                            <Link href={`/teams/${team.id}`} className="link">
                                {team.name}
                            </Link>!
                        </p>
                        <TeamRequestButtons notifId={notifId} teamId={teamId} userId={userId} role={role} />
                    </div>
                )
            }
            return (
                <Wrapper image={team.image || sender.image} imageLink={team.image ? `/teams/${team.id}` : `/profile/${senderId}`} imageAlt={team.image ? team.name : sender.name}>
                    {innerContent}
                </Wrapper>
            )
        default:
            break;
    }
    return null;
}
