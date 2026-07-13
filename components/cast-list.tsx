import Image from "next/image";
import { Suspense } from "react";
import { optimizeImage } from "@/lib/optimize-image";
import Loader from "@/components/loader";
import { getUserAbbreviated } from "@/lib/users";
import Link from "next/link";
import { pluralize } from "@/lib/helper-functions";
import { CastMember } from "@/types";
import { getTroupe } from "@/lib/troupes";

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-3 font-semibold text-sm">{children}</h3> : null;
}

async function MemberEntry(member: CastMember, noConfirm?: boolean) {
    if (member.id && (member.confirmed || noConfirm)) {
        return (
            <Link
                className="link flex flex-row gap-2 items-center w-fit"
                href={`/${member.role === 'troupe' ? 'troupes' : 'profile'}/${member.id}`}
            >
                {PlayerImage(member.id, member.role === 'troupe')}
                <P>{member.name}</P>
            </Link>
        )
    } else {
        return <P>{member.name}</P>
    }
}

async function PlayerImage(id: string, isTroupe?: boolean) {
    const user = isTroupe ? await getTroupe(id) : await getUserAbbreviated(id);
    const image = user?.image;
    if (!image) return null;
    return <Image
        src={optimizeImage(image, 72, 72, 90, true, true)}
        alt={user.name} width={36} height={36}
        className="mb-[10px] rounded-full"
    />
}

export default async function CastList({ castMembers, noConfirm }: { castMembers: CastMember[], noConfirm?: boolean }) {
    const players = castMembers.filter((member) => member.role === 'player');
    const coaches = castMembers.filter((member) => member.role === 'coach');
    const musicians = castMembers.filter((member) => member.role === 'musician');
    const directors = castMembers.filter((member) => member.role === 'director');
    const tech = castMembers.filter((member) => member.role === 'tech');
    const troupes = castMembers.filter((member) => member.role === 'troupe');
    return (
        <Suspense fallback={<Loader />}>
            <div className="flex flex-row flex-wrap px-6 justify-between">
                <div className="w-48 grow-2">
                    {players?.length ? <>
                        <Header>Players</Header>
                        <ul className="mt-2">
                            {players.map((player, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(player, noConfirm)}</li>
                            ))}
                        </ul>
                    </> : null}
                    {troupes?.length ? <>
                        <Header>{pluralize('Troupe', troupes.length)}</Header>
                        <ul className="mt-2">
                            {troupes.map((troupe, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(troupe, noConfirm)}</li>
                            ))}
                        </ul>
                    </> : null}
                </div>
                <div className="w-48 grow-1">
                    {directors.length > 0 && <>
                        <Header>{pluralize('Director', directors.length)}</Header>
                        <ul className="mt-2">
                            {directors.map((director, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(director, noConfirm)}</li>
                            ))}
                        </ul>
                    </>}
                    {tech.length > 0 && <>
                        <Header>Tech</Header>
                        <ul className="mt-2">
                            {tech.map((techMember, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(techMember, noConfirm)}</li>
                            ))}
                        </ul>
                    </>}
                    {musicians.length > 0 && <>
                        <Header>{pluralize('Musician', musicians.length)}</Header>
                        <ul className="mt-2">
                            {musicians.map((musician, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(musician, noConfirm)}</li>
                            ))}
                        </ul>
                    </>}
                    {coaches.length > 0 && <>
                        <Header>{pluralize('Coach', coaches.length)}</Header>
                        <ul className="mt-2">
                            {coaches.map((coach, i) => (
                                <li key={i} className="no-bullets">{MemberEntry(coach, noConfirm)}</li>
                            ))}
                        </ul>
                    </>}
                </div>
            </div>
        </Suspense>
    )
}