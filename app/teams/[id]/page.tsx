import { appName } from "@/lib/app-info";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { optimizeImage } from "@/lib/cloudinary";
import Loader from "@/components/loader";
import { getTeam, getTeamInvitationsByTeam } from "@/lib/teams";
import { getCurrentUser, getUser, getUserName } from "@/lib/users";
import Link from "next/link";
import { pluralize } from "@/lib/helper-functions";

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

async function PlayerLink(id: string) {
    const name = getUserName(id);
    return (
        <Link
            className="link flex flex-row gap-2 items-center fit-content"
            href={`/profile/${id}`}
        >
            {PlayerImage(id)}
            <P>{name}</P>
        </Link>
    )
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

    const currentUser = await getCurrentUser();
    const invitations = await getTeamInvitationsByTeam(id);

    const unconfirmedPlayers = invitations
        .filter((invite) => invite.role === 'player')
        .map((invite) => invite.invited);

    const unconfirmedCoaches = invitations
        .filter((invite) => invite.role === 'coach')
        .map((invite) => invite.invited);

    const unconfirmedMusicians = invitations
        .filter((invite) => invite.role === 'musician')
        .map((invite) => invite.invited);

    const isAdmin = currentUser && team.admins.includes(currentUser.id);
    const isMember = currentUser && (
        isAdmin ||
        team.players.includes(currentUser.id) ||
        unconfirmedPlayers.includes(currentUser.id) ||
        team.coaches.includes(currentUser.id) ||
        unconfirmedCoaches.includes(currentUser.id) ||
        team.musicians.includes(currentUser.id) ||
        unconfirmedMusicians.includes(currentUser.id)
    );

    const showUnconfirmedPlayers = isMember && unconfirmedPlayers.length > 0;
    const showUnconfirmedCoaches = isMember && unconfirmedCoaches.length > 0;
    const showUnconfirmedMusicians = isMember && unconfirmedMusicians.length > 0;

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
                            {team.players?.length > 0 && <>
                                <Header>{`${showUnconfirmedPlayers ? 'Confirmed ' : ''}${pluralize('Player', team.players.length > 0)}`}</Header>
                                <ul className="mt-2">
                                    {team.players.map((id, i) => (
                                        <li key={i} className="no-bullets">{PlayerLink(id)}</li>
                                    ))}
                                </ul>
                            </>}
                            {showUnconfirmedPlayers && <>
                                <Header>{`Unconfirmed ${pluralize('Player', unconfirmedPlayers.length > 0)}`}</Header>
                                <ul className="mt-2">
                                    {unconfirmedPlayers.map((id, i) => (
                                        <li key={i} className="no-bullets">{PlayerLink(id)}</li>
                                    ))}
                                </ul>
                            </>}
                        </div>
                        <div className="w-1/2">
                            {team.musicians?.length > 0 && <>
                                <Header>{`${showUnconfirmedMusicians ? 'Confirmed ' : ''}${pluralize('Musician', team.musicians.length > 0)}`}</Header>
                                <ul className="mt-2">
                                    {team.musicians.map((id, i) => (
                                        <li key={i} className="no-bullets">{PlayerLink(id)}</li>
                                    ))}
                                </ul>
                            </>}
                            {showUnconfirmedMusicians && <>
                                <Header>{`Unconfirmed ${pluralize('Musician', unconfirmedMusicians.length > 0)}`}</Header>
                                <ul className="mt-2">
                                    {unconfirmedMusicians.map((id, i) => (
                                        <li key={i} className="no-bullets">{PlayerLink(id)}</li>
                                    ))}
                                </ul>
                            </>}
                            {team.coaches?.length > 0 && <>
                                <Header>{`${showUnconfirmedCoaches ? 'Confirmed ' : ''}${pluralize('Coach', team.coaches.length > 0)}`}</Header>
                                <ul className="mt-2">
                                    {team.coaches.map((id, i) => (
                                        <li key={i} className="no-bullets">{PlayerLink(id)}</li>
                                    ))}
                                </ul>
                            </>}
                            {showUnconfirmedCoaches && <>
                                <Header>{`Unconfirmed ${pluralize('Coach', unconfirmedCoaches.length > 0)}`}</Header>
                                <ul className="mt-2">
                                    {unconfirmedCoaches.map((id, i) => (
                                        <li key={i} className="no-bullets">{PlayerLink(id)}</li>
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