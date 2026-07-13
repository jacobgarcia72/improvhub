import { leaveTroupe } from "@/actions";
import { appName } from "@/lib/app-info";
import LeaveTroupeConfirm from "@/components/leave-troupe-confirm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import Loader from "@/components/loader";
import { getTroupe, getTroupeMembers } from "@/lib/troupes";
import { getCurrentUser, getFollowing, getUser } from "@/lib/users";
import Link from "next/link";
import TroupeInvitationOptions from "../troupe-invitation-options";
import FollowButton from "@/components/follow-button";
import CoverPhoto from "@/components/cover-photo";
import { TheatreLink } from "@/components/theatre-link";
import { getTheatre } from "@/lib/theatres";

type Props = {
    params: Promise<{ id: string }>
    children: React.ReactNode;
}

export async function generateMetadata(
    { params }: {
    params: Promise<{ id: string }>
},
): Promise<Metadata> {
    const { id } = await params
    const troupe = await getTroupe(id);
    if (!troupe) return {};
    const { name, description, image } = troupe;
    const title = `${name} | ${appName}`;
    const metadata: Metadata = { title, description }
    if (image) {
        metadata.openGraph = {
            images: [{ url: image, alt: name }],
        }
    }
    return metadata;
}

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-1 font-semibold text-sm">{children}</h3> : null;
}

export default async function TroupeLayout({ params, children }: Props) {
    const { id } = await params;
    const troupe = await getTroupe(id);

    if (!troupe) notFound();

    const members = await getTroupeMembers(id, true);

    const currentUser = await getCurrentUser();
    const isMember = currentUser && members.some((member) => member.id === currentUser.id && member.confirmed);
    const openInvitations = members.filter((member) => member.id === currentUser?.id && !member.confirmed);
    const inviters = await Promise.all(openInvitations.map((invite) => getUser(invite.addedBy)));
    const following = currentUser ? (await getFollowing(currentUser.id, id, 'troupe')) || false : false;

    const theatres = troupe.theatres?.length ? (
        await Promise.all(troupe.theatres.map(async (t) => await getTheatre(t) || t))
    ).filter(t => t)
    .map(t => typeof t === 'string' ? t : ({ text: t.name, id: t.id, image: t.image })) : [];

    return (
        <Suspense fallback={<Loader />}>
            <section>
                <div className="w-full px-8">
                    <div className="w-full flex flex-row justify-between items-center">
                        <h1 className="text-2xl">{troupe.name}</h1>
                        {currentUser && <FollowButton userId={currentUser.id} followId={id} type="troupe" following={following} />}
                    </div>
                    {openInvitations.map((invite, i) => {
                        if (!inviters[i]) return null;
                        let joinVerb = 'join';
                        if (invite.role === 'coach') joinVerb = 'coach';
                        if (invite.role === 'musician') joinVerb = 'accompany';
                        return (
                            <div key={i} className="p-4 pl-8 my-2 bg-slate-100 div div-slate-200 rounded">
                                <p>
                                    {`You have been invited by `}
                                    <Link className="link" href={`profile/${inviters[i].id}`}>{`${inviters[i].firstName} ${inviters[i].lastName}`}</Link>
                                    {` to ${joinVerb} this troupe!`}
                                </p>
                                <TroupeInvitationOptions troupeId={troupe.id} userId={currentUser?.id || ''} role={invite.role} />
                            </div>
                        )
                    })}
                </div>
                {troupe.image && <CoverPhoto src={troupe.image} alt={troupe.name} photoCredit={troupe.photoCredit} />}
                    {!isMember && (
                        <div className="flex flex-row flex-wrap gap-2 pt-2 px-7">
                            {currentUser?.openToJoinTroupe && troupe.lookingForPlayers ? (
                                <div className="bg-slate-100 rounded border border-gray-700 py-0.5 px-2">Looking for Players!</div>
                            ) : null}
                            {currentUser?.openToAccompanyTroupe && troupe.lookingForMusician ? (
                                <div className="bg-slate-100 rounded border border-gray-700 py-0.5 px-2">Looking for Musician!</div>
                            ) : null}
                            {currentUser?.openToCoachTroupe && troupe.lookingForCoach ? (
                                <div className="bg-slate-100 rounded border border-gray-700 py-0.5 px-2">Looking for Coach!</div>
                            ) : null}
                        </div>
                    )}
                <div className="px-8 pt-2">
                    {troupe.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                </div>
            </section>
            {children}
            {(troupe.city && troupe.state) || theatres.length > 0 ? (
                <section>
                    <div className="px-8">
                        {troupe.city && troupe.state ? <>
                            <Header>Location</Header>
                            <P>
                                <Link
                                    href={`/search?for=troupes&location=${troupe.city}+${troupe.state}&miles=10`}
                                    className="link"
                                >{`${troupe.city}, ${troupe.state}`}</Link>
                            </P>
                        </> : null}
                        {theatres.length > 0 && <Header>Theatres</Header>}
                        {theatres.map((theatre, i) => (
                            <TheatreLink key={i} theatre={theatre} />
                        ))}
                    </div>
                </section>
            ) : null}
            {isMember ? (
                <section className="flex flex-row justify-center">
                    <form action={leaveTroupe.bind(null, id)}>
                        <LeaveTroupeConfirm />
                    </form>
                </section>
            ) : null}
        </Suspense>
    )
}
