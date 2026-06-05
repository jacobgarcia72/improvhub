import { appName } from "@/lib/app-info";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import Loader from "@/components/loader";
import { getTeam, getTeamMembers } from "@/lib/teams";
import { getCurrentUser, getFollowerCount, getFollowing, getUser } from "@/lib/users";
import Link from "next/link";
import TeamInvitationOptions from "../team-invitation-options";
import CastList from "@/components/cast-list";
import FollowButton from "@/components/follow-button";
import CoverPhoto from "@/components/cover-photo";

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    // read route params
        const { id } = await params

    // fetch data
    const team = await getTeam(id);

    return {
        title: team?.name || appName,
        description: team?.description
    }
}

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-3 font-semibold text-sm">{children}</h3> : null;
}

export default async function TeamPage({ params }: Props) {
    const { id } = await params;
    const team = await getTeam(id);

    if (!team) notFound();

    const members = await getTeamMembers(id);

    const currentUser = await getCurrentUser();
    const openInvitations = members.filter((member) => member.id === currentUser?.id && !member.confirmed);
    const inviters = await Promise.all(openInvitations.map((invite) => getUser(invite.addedBy)));
    const following = currentUser ? (await getFollowing(currentUser.id, id, 'team')) || false : false;

    const followerCount = await getFollowerCount(id, 'team');

    // const isAdmin = currentUser && team.admins.includes(currentUser.id);
    // const isMember = currentUser && (
    //     isAdmin ||
    //     members.find((member) => member.id === currentUser.id)
    // );

    return (
        <Suspense fallback={<Loader />}>
            <section>
                <div className="w-full px-8">
                    <div className="w-full flex flex-row justify-between items-center">
                        <h1 className="text-2xl">{team.name}</h1>
                        {currentUser && <FollowButton userId={currentUser.id} followId={id} type="team" following={following} />}
                    </div>
                    {openInvitations.map((invite, i) => {
                        if (!inviters[i]) return null;
                        let joinVerb = 'join';
                        if (invite.role === 'coach') joinVerb = 'coach';
                        if (invite.role === 'musician') joinVerb = 'accompany';
                        return (
                            <div key={i} className="p-4 pl-8 my-2 bg-slate-100 border border-slate-200 rounded">
                                <p>
                                    {`You have been invited by `}
                                    <Link className="link" href={`profile/${inviters[i].id}`}>{`${inviters[i].firstName} ${inviters[i].lastName}`}</Link>
                                    {` to ${joinVerb} this team!`}
                                </p>
                                <TeamInvitationOptions teamId={team.id} userId={currentUser?.id || ''} role={invite.role} />
                            </div>
                        )
                    })}
                </div>
                {team.image && <CoverPhoto src={team.image} alt={team.name} photoCredit={team.photoCredit} />}
                <div className="px-8 pt-2">
                    {team.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                </div>
            </section>
            <section>
                <CastList castMembers={members} />
            </section>
            {(team.city && team.state) || team.theatres.length > 0 ? (
                <section>
                    <div className="px-8">
                        {team.city && team.state ? <>
                            <Header>Location</Header>
                            <P>
                                <Link
                                    href={`/search?for=teams&location=${team.city}+${team.state}&miles=10`}
                                    className="link"
                                >{`${team.city}, ${team.state}`}</Link>
                            </P>
                        </> : null}
                        {team.theatres.length > 0 && <Header>Theatres</Header>}
                        {team.theatres.map((theatre, i) => (
                            <P key={i}>
                                <Link
                                    href={`/search?for=teams&theatre=${theatre.toLowerCase().split(' ').join('+')}`}
                                    className="link"
                                >{theatre}</Link>
                            </P>
                        ))}
                    </div>
                </section>
            ) : null}
            {followerCount ? (
                <section>
                    <p className="pl-8">{`${followerCount} Followers`}</p>
                </section>
            ) : null}
        </Suspense>
    )
}