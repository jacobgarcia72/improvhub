import { optimizeImage } from "@/lib/optimize-image";
import { getFriendship, getUser, getUserAbbreviated } from "@/lib/users";
import { Notification, Role } from "@/types";
import Image from "next/image";
import Link from "next/link";
import FriendRequestButtons from "./friend-request-buttons";
import { getTeam, getTeamMembership } from "@/lib/teams";
import { getPronounForm } from "@/lib/demographics";
import TeamRequestButtons from "./team-request-buttons";
import { getVerbFromRole } from "@/lib/helper-functions";
import { getShow } from "@/lib/shows";
import { formatDateTimeForDisplay } from "@/lib/dates";

function Wrapper({ children, image, imageLink, imageAlt }: { children: React.ReactNode, image?: string | null, imageLink: string, imageAlt: string }) {
    return (
        <div className="border-b border-b-black/20 px-2 pb-3">
            <div className="flex flex-row gap-2 items-start">
                <div className="w-12 h-12">
                    {image ? <Link href={imageLink}>
                        <Image
                            src={optimizeImage(image, 100, 100, 90, true)}
                            alt={imageAlt} width={50} height={50}
                            className="rounded"
                        />
                    </Link> : null}
                </div>
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default async function NotificationCard({ notification, userId }: { notification: Notification, userId: string }) {
    const { type, sender: senderId, id: notifId, data } = notification;
    let innerContent: React.ReactNode;
    switch (type) {
        case 'friend_request':
            const sender = await getUserAbbreviated(senderId);
            if (!sender) return null;
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
            const sender2 = await getUserAbbreviated(senderId);
            if (!sender2) return null;
            return (
                <Wrapper image={sender2.image} imageLink={`/profile/${senderId}`} imageAlt={sender2.name}>
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender2.name}
                            </Link>
                            &nbsp;accepted your friend request
                        </p>
                </Wrapper>
            )
        case 'added_to_team':
            const sender3 = await getUserAbbreviated(senderId);
            if (!sender3) return null;
            if (!data) return null;
            const [teamId, role] = data.split(',');
            const team = await getTeam(teamId);
            const pronouns = (await getUser(senderId))?.pronouns;
            const membership = await getTeamMembership(userId, teamId, role as Role);
            if (!team || !membership) return null;
            const hasConfirmed = membership.confirmed;
            if (hasConfirmed) {
                innerContent = (
                    <p>
                        You accepted&nbsp;
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender3.name}
                        </Link>
                        &apos;s invitation to {getVerbFromRole(role as Role)} &nbsp;
                        <Link href={`/teams/${team.id}`} className="link">
                            {team.name}
                        </Link>
                    </p>
                )
            } else {
                innerContent = (
                    <div className="flex flex-col gap-1">
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender3.name}
                            </Link>
                            &nbsp;has invited you to&nbsp;{getVerbFromRole(role as Role)}&nbsp;{getPronounForm(pronouns, 2)}&nbsp;team,&nbsp;
                            <Link href={`/teams/${team.id}`} className="link">
                                {team.name}
                            </Link>!
                        </p>
                        <TeamRequestButtons notifId={notifId} teamId={teamId} userId={userId} role={role} />
                    </div>
                )
            }
            return (
                <Wrapper image={team.image || sender3.image} imageLink={team.image ? `/teams/${team.id}` : `/profile/${senderId}`} imageAlt={team.image ? team.name : sender3.name}>
                    {innerContent}
                </Wrapper>
            )
        case 'confirmed_team':
            const sender4 = await getUserAbbreviated(senderId);
            if (!sender4) return null;
            if (!data) return null;
            const [teamId2, role2] = data.split(',');
            const team2 = await getTeam(teamId2);
            const membership2 = await getTeamMembership(senderId, teamId2, role2 as Role);
            if (!team2 || !membership2) return null;
            return (
                <Wrapper image={sender4.image || team2.image} imageLink={sender4.image ? `/profile/${senderId}` : `/teams/${team2.id}`} imageAlt={sender4.image ? sender4.name : team2.name}>
                    <p>
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender4.name}
                        </Link>
                        &nbsp;accepted your invitation to {getVerbFromRole(role2 as Role)}&nbsp;
                        <Link href={`/teams/${team2.id}`} className="link">
                            {team2.name}
                        </Link>
                    </p>
                </Wrapper>
            )
        case 'cast_in_show':
            if (!data) return null;
            const [showDateTime, role3, teamId3] = data.split(',');
            const show = await getShow(senderId);
            if (!show) return null;
            if (role3 === 'team') {
                const team = await getTeam(teamId3);
                if (!team) return null;
                return (
                    <Wrapper image={show.image || team.image} imageLink={show.image ? `/shows/${senderId}` : `/teams/${team.id}`} imageAlt={show.image ? show.title : team.name}>
                        <p>
                            <Link href={`/teams/${team.id}/`} className="link">
                                {team.name}
                            </Link>
                            &nbsp;have been cast to play in&nbsp;
                            <Link href={`/shows/${show.id}/${showDateTime}`} className="link">
                                {show.title}
                            </Link> on {formatDateTimeForDisplay(showDateTime)}
                        </p>
                    </Wrapper>
                )
            } else {
                return (
                    <Wrapper image={show.image} imageLink={`/shows/${senderId}`} imageAlt={show.title}>
                        <p>
                            You&apos;ve been cast as a&nbsp;{role3}&nbsp;in&nbsp;
                            <Link href={`/shows/${show.id}/${showDateTime}`} className="link">
                                {show.title}
                            </Link> on {formatDateTimeForDisplay(showDateTime)}
                        </p>
                    </Wrapper>
                )
            }
        case 'show_drop_out':
            if (!data) return null;
            const [showId, showDateTime2, role4] = data.split(',');
            const show2 = await getShow(showId);
            const isTeam = role4 === 'team';
            const dropOut = isTeam ? await getTeam(senderId) : await getUserAbbreviated(senderId);
            if (!show2 || !dropOut) return null;
            let verb = '';
            if (role4 === 'director') verb = ' directing';
            if (role4 === 'tech') verb = ' teching';
            if (role4 === 'musician') verb = ' accompanying';
            return (
                    <Wrapper image={show2.image} imageLink={`/shows/${show2.id}`} imageAlt={show2.title}>
                        <p>
                            <Link href={`/${isTeam ? 'teams' : 'profile'}/${dropOut.id}/`} className="link">
                                {dropOut.name}
                            </Link>
                            &nbsp;{isTeam ? 'have' : 'has'} dropped out of{verb}&nbsp;
                            <Link href={`/shows/${show2.id}/${showDateTime2}`} className="link">
                                {show2.title}
                            </Link> on {formatDateTimeForDisplay(showDateTime2)}
                        </p>
                    </Wrapper>
                )
        default:
            break;
    }
    return null;
}
