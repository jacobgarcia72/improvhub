import Image from "next/image";
import { Suspense } from "react";
import { optimizeImage } from "@/lib/cloudinary";
import Loader from "@/components/loader";
import { getUser } from "@/lib/users";
import Link from "next/link";
import { pluralize } from "@/lib/helper-functions";
import { CastMember } from "@/types";

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-3 font-semibold text-sm">{children}</h3> : null;
}

async function MemberEntry(member: CastMember) {
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

export default async function CastList({ castMembers }: { castMembers: CastMember[]}) {
    const players = castMembers.filter((member) => member.role === 'player');
    const coaches = castMembers.filter((member) => member.role === 'coach');
    const musicians = castMembers.filter((member) => member.role === 'musician');
    const directors = castMembers.filter((member) => member.role === 'director');
    const tech = castMembers.filter((member) => member.role === 'tech');
    return (
        <Suspense fallback={<Loader />}>
            <div className="flex flex-row flex-wrap px-8">
                <div className="w-1/2">
                    {players?.length ? <>
                        <Header>{pluralize('Player', players.length)}</Header>
                        <ul className="mt-2">
                            {players.map((player, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(player)}</li>
                            ))}
                        </ul>
                    </> : null}
                </div>
                <div className="w-1/2">
                    {directors.length > 0 && <>
                        <Header>{pluralize('Director', directors.length)}</Header>
                        <ul className="mt-2">
                            {directors.map((director, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(director)}</li>
                            ))}
                        </ul>
                    </>}
                    {tech.length > 0 && <>
                        <Header>Tech</Header>
                        <ul className="mt-2">
                            {tech.map((techMember, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(techMember)}</li>
                            ))}
                        </ul>
                    </>}
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
        </Suspense>
    )
}