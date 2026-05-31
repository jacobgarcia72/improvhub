import { appName } from "@/lib/app-info";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { optimizeImage } from "@/lib/cloudinary";
import Loader from "@/components/loader";
import { getTeam, getTeamMembers } from "@/lib/teams";
import { getUser } from "@/lib/users";
import Link from "next/link";
import { pluralize } from "@/lib/helper-functions";
import { TeamMember } from "@/types";

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

    // const currentUser = await getCurrentUser();
    // const isAdmin = currentUser && team.admins.includes(currentUser.id);
    // const isMember = currentUser && (
    //     isAdmin ||
    //     members.find((member) => member.id === currentUser.id)
    // );

    return (
        <Suspense fallback={<Loader />}>
            <section>
                <div className="px-4">
                    <div className="w-full">
                        <h1 className="text-2xl">{team.name}</h1>
                        {/* TODO: Add headline */}
                        {/* {team.headline && <h2 className="mb-3">{team.headline}</h2>} */}
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
                    {team.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                    <div className="flex flex-row flex-wrap">
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
                    <P className="text-sm">{team.city && team.state && `${team.city}, ${team.state}`}</P>
                    </div>
                </div>
            </section>
        </Suspense>
    )
}