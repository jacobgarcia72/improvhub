import { logout } from "@/actions/auth-actions";
import Loader from "@/components/loader";
import Button from "@/components/form/button";
import { verifyAuth } from "@/lib/auth";
import { getFollowCount, getUser, getUserRoles } from "@/lib/users";
import { User } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getTeam, getTeamMembershipsByUser } from "@/lib/teams";
import MiniCard from "@/components/mini-card";
import CommunityOptions from "./community-options";
import CommunityDetails from "./community-details";
import OpenToCheckbox from "./open-to-checkbox";
import WebsiteOptions from "./website-options";
import BioOptions from "./bio-options";
import { pluralize } from "@/lib/helper-functions";

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

    const currentUserId = (await verifyAuth()).user?.id;
    const isCurrentUser = username === currentUserId;
    const userRoles = (await getUserRoles(username)) ?? undefined;

    const followerCount = await getFollowCount(username, 'user') || 0;
    const teamsFollowedCount = await getFollowCount(username, 'team', true) || 0;
    const usersFollowedCount = await getFollowCount(username, 'user', true) || 0;

    const teamMemberships = await getTeamMembershipsByUser(username);
    const teams = (await Promise.all([...new Set(teamMemberships.filter((m) => m.role !== 'coach').map((m) => m.team))].map(getTeam))).filter((t) => t !== null);
    const coachedTeams = (await Promise.all([...new Set(teamMemberships.filter((m) => m.role === 'coach').map((m) => m.team))].map(getTeam))).filter((t) => t !== null);
    return (
        <Suspense fallback={<Loader />}>
            {followerCount || usersFollowedCount ? (
                <LayoutCard className="flex flex-row justify-center">
                    <div className="flex flex-row w-2/5 min-w-[300px] justify-center">
                        {followerCount > 0 && <div className="flex flex-col w-1/2 items-center">
                            <p className="text-slate-600 font-semibold text-sm">Followed by</p>
                            <Link href={`/profile/${username}/followers`} className="link">
                                {`${followerCount} ${pluralize('Person', followerCount)}`}
                            </Link>
                        </div>}
                        {usersFollowedCount > 0 && <div className="flex flex-col w-1/2 items-center">
                            <p className="text-slate-600 font-semibold text-sm">Follows</p>
                            <Link href={`/profile/${username}/users-followed`} className="link">
                                {`${usersFollowedCount} ${pluralize('Person', usersFollowedCount)}`}
                            </Link>
                        </div>}
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
                </>}
                {teamsFollowedCount > 0 && (
                    <div className="w-full flex flex-row justify-center">
                        <Link href={`/profile/${username}/teams-followed`} className="link mt-2 text-sm">
                            {`Following ${teamsFollowedCount} ${pluralize('Team', teamsFollowedCount)}`}
                        </Link>
                    </div>
                )}
                {isCurrentUser && <>
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