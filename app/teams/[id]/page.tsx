import { appName } from "@/lib/app-info";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { optimizeImage } from "@/lib/cloudinary";
import Loader from "@/components/loader";
import { getTeam, getTeamMembers } from "@/lib/teams";
import { getCurrentUser, getUser } from "@/lib/users";
import Link from "next/link";
import { pluralize } from "@/lib/helper-functions";
import { TeamMember } from "@/types";
import TeamInvitationOptions from "../team-invitation-options";

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

async function MemberEntry(member: TeamMember) {
    if (member.id && member.confirmed) {
        return (
            <Link
                className="link flex flex-row gap-2 items-center fit-content"
                href={`/profile/${member.id}`}
            >
                {PlayerImage(member.id)}
                <P>{member.name}</P>
            </Link>
        )
    } else {
        return <P>{member.name}</P>
    }
}

async function PlayerImage(id: string) {
    const user = await getUser(id);
    const image = user?.image;
    if (!image) return null;
    return <Image
        src={optimizeImage(image, 72, 72, 90, true, true)}
        alt={user.firstName} width={36} height={36}
        className="mb-[10px]"
    />
} 

export default async function TeamPage({ params }: Props) {
    const { id } = await params;
    const team = await getTeam(id);

    if (!team) notFound();

    const members = await getTeamMembers(id);
    const players = members.filter((member) => member.role === 'player');
    const coaches = members.filter((member) => member.role === 'coach');
    const musicians = members.filter((member) => member.role === 'musician');

    const currentUser = await getCurrentUser();
    const openInvitations = members.filter((member) => member.id === currentUser?.id && !member.confirmed);
    const inviters = await Promise.all(openInvitations.map((invite) => getUser(invite.addedBy)));

    // const isAdmin = currentUser && team.admins.includes(currentUser.id);
    // const isMember = currentUser && (
    //     isAdmin ||
    //     members.find((member) => member.id === currentUser.id)
    // );

    return (
        <Suspense fallback={<Loader />}>
            <section>
                <div className="w-full px-8">
                    <h1 className="text-2xl">{team.name}</h1>
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
                {team.image && <>
                    <Image src={optimizeImage(team.image, 600, null, 80)}
                        alt={team.name}
                        width={600}
                        height={400}
                        className="mt-2 w-full h-auto min-h-18 max-h-[90vh] h-72 object-cover rounded"
                    />
                    <P className="italic text-sm">{team.image && team.photoCredit && `Photo Credit: ${team.photoCredit}`}</P>
                </>}
                <div className="px-8 pt-2">
                    {team.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                </div>
            </section>
            <section>
                <div className="flex flex-row flex-wrap px-8">
                    <div className="w-1/2">
                        {players.length > 0 && <>
                            <Header>{pluralize('Player', players.length)}</Header>
                            <ul className="mt-2">
                                {players.map((player, i) => (
                                    <li key={i} className="no-bullets">{MemberEntry(player)}</li>
                                ))}
                            </ul>
                        </>}
                    </div>
                    <div className="w-1/2">
                        {musicians.length > 0 && <>
                            <Header>{pluralize('Musician', musicians.length)}</Header>
                            <ul className="mt-2">
                                {musicians.map((musician, i) => (
                                    <li key={i} className="no-bullets">{MemberEntry(musician)}</li>
                                ))}
                            </ul>
                        </>}
                        {coaches.length > 0 && <>
                            <Header>{pluralize('Coach', coaches.length)}</Header>
                            <ul className="mt-2">
                                {coaches.map((coach, i) => (
                                    <li key={i} className="no-bullets">{MemberEntry(coach)}</li>
                                ))}
                            </ul>
                        </>}
                    </div>
                </div>
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
        </Suspense>
    )
}