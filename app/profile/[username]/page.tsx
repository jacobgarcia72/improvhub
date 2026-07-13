import { logout } from "@/actions/auth-actions";
import Loader from "@/components/loader";
import Button from "@/components/form/button";
import { verifyAuth } from "@/lib/auth";
import { getFollowCount, getFriendCount, getUser, getUserRoles } from "@/lib/users";
import { User } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getTroupe, getTroupeMembershipsByUser } from "@/lib/troupes";
import MiniCard from "@/components/mini-card";
import CommunityOptions from "./community-options";
import CommunityDetails from "./community-details";
import OpenToCheckbox from "./open-to-checkbox";
import WebsiteOptions from "./website-options";
import BioOptions from "./bio-options";
import { pluralize } from "@/lib/helper-functions";
import UpcomingShows from "@/components/upcoming-shows";

function LayoutCard({
    children, className, header
}: Readonly<{
    children?: React.ReactNode, className?: string, header?: string
}>) {
    const content = children?.valueOf();
    if (!content || (Array.isArray(content) && !content.find(Boolean))) return null;
    return (
        <section className={className}>
            {header && <h2 className="text-slate-700 dark:text-slate-300 font-semibold">{header}</h2>}
            {children}
        </section>
    )
}

export default async function UserProfilePage({ params }: { params: Promise<{username: string}> }) {
    const { username } = await params;
    const user = await getUser(username) as User | undefined;
    if (!user) return notFound();

    const currentUserId = (await verifyAuth()).user?.id;
    const isCurrentUser = username === currentUserId;
    const userRoles = (await getUserRoles(username)) ?? undefined;

    const friendCount = await getFriendCount(username);
    const troupesFollowedCount = await getFollowCount(username, 'troupe', true) || 0;

    const troupeMemberships = await getTroupeMembershipsByUser(username);
    const troupes = (await Promise.all([...new Set(troupeMemberships.filter((m) => m.role !== 'coach').map((m) => m.troupe))].map(getTroupe))).filter((t) => t !== null);
    const coachedTroupes = (await Promise.all([...new Set(troupeMemberships.filter((m) => m.role === 'coach').map((m) => m.troupe))].map(getTroupe))).filter((t) => t !== null);
    return (
        <Suspense fallback={<Loader />}>
            {friendCount ? (
                <LayoutCard className="flex flex-row justify-center">
                    <div className="w-full flex flex-row justify-center">
                        <Link href={`/profile/${username}/friends`} className="link text-sm">
                            {`${friendCount} ${pluralize('Friend', friendCount)}`}
                        </Link>
                    </div>
                </LayoutCard>
            ) : null}
            <LayoutCard header={user.bio ? "Bio" : ''}>
                {isCurrentUser ? (
                    <BioOptions user={user} />
                ) : user.bio && user.bio.split('<br>').map((line, i) => <p key={i} className="min-h-3">{line || '  '}</p>)}
            </LayoutCard>
            <LayoutCard header={user.state || user.city || user.theatres ? "Community" : ''}>
                {isCurrentUser ? (
                    <CommunityOptions user={user} />
                ) : (
                    user.state || user.city || user.theatres ? (
                        <CommunityDetails user={user} />
                    ) : null
                )}
            </LayoutCard>
            <LayoutCard header="Troupes">
                {troupes.length ? (
                    <div className="flex flex-row flex-wrap">
                        {troupes.map((troupe) => <MiniCard key={troupe.id} item={troupe} type='troupe' includeDescription />)}
                    </div>
                ) : null}
                {isCurrentUser && <>
                    {userRoles?.player ? <OpenToCheckbox
                        user={user}
                        openToKey="openToJoinTroupe"
                        label="Open to Joining Troupes"
                    /> : null}
                    {userRoles?.musician ? <OpenToCheckbox
                        user={user}
                        openToKey="openToAccompanyTroupe"
                        label="Open to Accompanying Musical Troupes"
                    /> : null}
                </>}
                {!isCurrentUser && user.openToJoinTroupe && <p className="pt-2">Open to Joining Troupes</p>}
                {!isCurrentUser && user.openToAccompanyTroupe && <p className="pt-2">Open to Accompanying Musical Troupes</p>}
                {troupesFollowedCount > 0 && (
                    <div className="w-full flex flex-row justify-center">
                        <Link href={`/profile/${username}/troupes-followed`} className="link mt-2 text-sm">
                            {`Following ${troupesFollowedCount} ${pluralize('Troupe', troupesFollowedCount)}`}
                        </Link>
                    </div>
                )}
                {isCurrentUser && <>
                    <div className="w-full flex flex-row justify-center">
                        <Link href="/create/troupe">
                            <Button caption="New Troupe" style="link" className="w-48" />
                        </Link>
                    </div>
                </>}
            </LayoutCard>
            {userRoles?.coach ? <LayoutCard header="Coaching">
                {coachedTroupes.length ? (
                    <div className="flex flex-row flex-wrap">
                        {coachedTroupes.map((troupe) => <MiniCard key={troupe.id} item={troupe} type='troupe' />)}
                    </div>
                ) : null}
                {isCurrentUser && <>
                    <OpenToCheckbox
                        user={user}
                        openToKey="openToCoachTroupe"
                        label="Available to Coach"
                    />
                </>}
                {!isCurrentUser && user.openToCoachTroupe && <p className="pt-2">Available to Coach</p>}
            </LayoutCard> : null}
            <UpcomingShows includeTroupes id={username} limit={6} />
            <LayoutCard header={user.website ? "Website" : ''}>
                {isCurrentUser ? (
                    <WebsiteOptions user={user} />
                ) : user.website && <a className="link" target="_blank" href={user.website}>{user.website}</a>}
            </LayoutCard>
            <LayoutCard>
                {isCurrentUser && <div className="w-full flex flex-col items-center">
                    <Link href={`/account`}>
                        <Button caption="Account Settings" style="link" />
                    </Link>
                    <Button
                        caption="Sign Out"
                        onClick={logout}
                        style="link"
                    />
                </div>}
            </LayoutCard>
        </Suspense>
    )
}