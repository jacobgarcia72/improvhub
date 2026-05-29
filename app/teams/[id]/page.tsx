import { appName } from "@/lib/app-info";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { optimizeImage } from "@/lib/cloudinary";
import Loader from "@/components/loader";
import { getTeam } from "@/lib/teams";
import { getCurrentUser, getUserName } from "@/lib/users";

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

    const currentUser = await getCurrentUser();

    const playerNames = team.players.map(async (id) => await getUserName(id));
    const coachName = team.coach ? await getUserName(team.coach) : null;
    const musicianName = team.musician ? await getUserName(team.musician) : null;

    let unconfirmedPlayerNames: string[] | null | Promise<string | null>[] = null;
    let unconfirmedCoachName: string | null = null;
    let unconfirmedMusicianName: string | null = null;

    if (currentUser && team.admins.includes(currentUser.id)) {
        unconfirmedPlayerNames = team.unconfirmedPlayers.map(async (id) => await getUserName(id));
        if (!unconfirmedPlayerNames.length) unconfirmedPlayerNames = null;
        unconfirmedCoachName = team.unconfirmedCoach ? await getUserName(team.unconfirmedCoach) : null;
        unconfirmedMusicianName = team.unconfirmedMusician ? await getUserName(team.unconfirmedMusician) : null;
    }
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
                    <P>{team.city && team.state && `${team.city}, ${team.state}`}</P>
                    {team.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                    <div className="flex flex-row flex-wrap">
                        <div className="w-1/2">
                            {playerNames?.length > 0 && <>
                                <Header>{`${unconfirmedPlayerNames ? 'Confirmed ' : ''}Players`}</Header>
                                <ul className="mt-2">
                                    {playerNames.map((player, i) => (
                                        <li key={i} className="no-bullets">{player}</li>
                                    ))}
                                </ul>
                            </>}
                            {unconfirmedPlayerNames && <>
                                <Header>{`(Unconfirmed Players)`}</Header>
                                <ul className="mt-2">
                                    {unconfirmedPlayerNames.map((player, i) => (
                                        <li key={i} className="no-bullets">{player}</li>
                                    ))}
                                </ul>
                            </>}
                        </div>
                        <div className="w-1/2">
                            {musicianName && <Header>Musician</Header>}
                            <P>{musicianName}</P>
                            {unconfirmedMusicianName && <Header>Musician (Unconfirmed)</Header>}
                            <P>{unconfirmedMusicianName}</P>
                            {coachName && <Header>Coach</Header>}
                            <P>{coachName}</P>
                            {unconfirmedCoachName && <Header>Coach (Unconfirmed)</Header>}
                            <P>{unconfirmedCoachName}</P>
                        </div>
                    </div>
                </div>
            </section>
        </Suspense>
    )
}