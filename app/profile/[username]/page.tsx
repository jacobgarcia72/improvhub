import { logout } from "@/actions/auth-actions";
import Loader from "@/components/loader";
import Button from "@/components/form/button";
import { isSignedIn, verifyAuth } from "@/lib/auth";
import { getFollowing, getUser, getUserRoles } from "@/lib/users";
import { User } from "@/types";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getTeam, getTeamMembershipsByUser } from "@/lib/teams";
import MiniCard from "@/components/mini-card";
import CommunityOptions from "./community-options";
import CommunityDetails from "./community-details";
import OpenToCheckbox from "./open-to-checkbox";
import UserDetails from "./user-details";
import UserOptions from "./user-options";
import WebsiteOptions from "./website-options";
import BioOptions from "./bio-options";
import FollowButton from "@/components/follow-button";

function LayoutCard({
    children, className, header
}: Readonly<{
    children?: React.ReactNode, className?: string, header?: string
}>) {
    if (!children) return null;
    return (
        <section className={className}>
            {header && <h2 className="text-slate-700 font-semibold">{header}</h2>}
            {children}
        </section>
    )
}

export default async function UserProfilePage({ params }: { params: Promise<{username: string}> }) {

    const { username } = await params;
    const user = await getUser(username) as User | undefined;
    if (!user) notFound();

    if (!(await isSignedIn())) {
        redirect(`/login?reroute=profile%2F${username}`);
    }

    const currentUserId = (await verifyAuth()).user?.id;
    const isCurrentUser = username === currentUserId;
    const userRoles = (await getUserRoles(username)) ?? undefined;

    const following = isCurrentUser ? null : await getFollowing(currentUserId, username, 'user');
    const mutualFollowing = following && await getFollowing(username, currentUserId, 'user');

    const teamMemberships = await getTeamMembershipsByUser(username);
    const teams = (await Promise.all([...new Set(teamMemberships.filter((m) => m.role !== 'coach').map((m) => m.team))].map(getTeam))).filter((t) => t !== null);
    const coachedTeams = (await Promise.all([...new Set(teamMemberships.filter((m) => m.role === 'coach').map((m) => m.team))].map(getTeam))).filter((t) => t !== null);
    return (
        <Suspense fallback={<Loader />}>
            <LayoutCard className="relative">
                {!isCurrentUser && <div className="absolute right-3 top-2">
                    <FollowButton
                        userId={currentUserId}
                        followId={username}
                        type="user"
                        following={following}
                        caption={mutualFollowing ? 'Friends' : null}
                    />
                </div>}
                {isCurrentUser ? (
                    <UserOptions user={user} userRoles={userRoles} />
                ) : <UserDetails user={user} userRoles={userRoles} />}
            </LayoutCard>
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
            <LayoutCard header="Teams">
                {teams.length ? (
                    <div className="flex flex-row flex-wrap justify-center">
                        {teams.map((team) => <MiniCard key={team.id} item={team} type='team' />)}
                    </div>
                ) : null}
                {isCurrentUser && <>
                    {userRoles?.player ? <OpenToCheckbox
                        user={user}
                        openToKey="openToJoinTeam"
                        label="Open to joining teams"
                    /> : null}
                    {userRoles?.musician ? <OpenToCheckbox
                        user={user}
                        openToKey="openToAccompanyTeam"
                        label="Open to accompanying musical teams"
                    /> : null}
                    <div className="w-full flex flex-row justify-center">
                        <Link href="/create/team">
                            <Button caption="New Team" style="link" className="w-48" />
                        </Link>
                    </div>
                </>}
            </LayoutCard>
            {userRoles?.coach ? <LayoutCard header="Coaching">
                {coachedTeams.length ? (
                    <div className="flex flex-row flex-wrap justify-center">
                        {coachedTeams.map((team) => <MiniCard key={team.id} item={team} type='team' />)}
                    </div>
                ) : null}
                {isCurrentUser && <>
                    <OpenToCheckbox
                        user={user}
                        openToKey="openToCoachTeam"
                        label="Open to coaching teams"
                    />
                </>}
            </LayoutCard> : null}
            <LayoutCard header={user.website ? "Website" : ''}>
                {isCurrentUser ? (
                    <WebsiteOptions user={user} />
                ) : user.website && <a className="link" target="_blank" href={user.website}>{user.website}</a>}
            </LayoutCard>
            <LayoutCard>
                {isCurrentUser && <div className="w-full flex flex-row justify-center">
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