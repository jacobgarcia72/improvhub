import { logout } from "@/actions/auth-actions";
import Loader from "@/components/loader";
import Button from "@/components/form/button";
import { isSignedIn, verifyAuth } from "@/lib/auth";
import { optimizeImage } from "@/lib/cloudinary";
import { getUser } from "@/lib/users";
import { User } from "@/types";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Checkbox from "@/components/form/checkbox";
import { getTeamsByUser } from "@/lib/teams";
import MiniCard from "@/components/mini-card";

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

    const isCurrentUser = username === (await verifyAuth()).user?.id;

    let displayName = user.firstName;
    let initials = user.firstName[0];
    if (user.lastName) {
        displayName += ` ${user.lastName}`
        initials += user.lastName[0];
    }

    const teams = await getTeamsByUser(username);
    // let theatres = user.theatre || '';
    // if (theatres && user.secondaryTheatre) theatres += `, ${user.secondaryTheatre}`

    return (
        <Suspense fallback={<Loader />}>
            <LayoutCard className="flex flex-row">
                <div className="pl-4">
                    {user.image ? (
                        <Image loading="eager" className="object-cover rounded-xl w-32 h-32"
                            src={optimizeImage(user.image, 320, 320, null, true)} alt={displayName} width={120} height={120} />
                    ) : (
                        <div className="h-full w-full">{initials}</div>
                    )}
                </div>
                <div className="pl-2 flex flex-col justify-end pl-4">
                    <h1 className="text-xl">{displayName}{user.pronouns && <span className="text-sm">&nbsp;({user.pronouns})</span>}</h1>
                    {user.headline && <h2>{user.headline}</h2>}
                </div>
            </LayoutCard>
            <LayoutCard header="Bio">
                {user.bio}
            </LayoutCard>
            {/* <LayoutCard header="Theatres">
                {theatres}
            </LayoutCard> */}
            <LayoutCard header="Teams">
                {teams.length ? (
                    <div className="flex flex-row flex-wrap justify-center">
                        {teams.map((team) => <MiniCard key={team.id} item={team} type='team' />)}
                    </div>
                ) : (
                    <div className="h-12 mt-3 ml-1">
                        <p className="label">No teams to display</p>
                    </div>
                )}
                {isCurrentUser && ( 
                    <div className="pl-3 pt-1">
                        <Checkbox name="lookingForTeam" label="Open to joining teams" />
                    </div>
                )}
                {isCurrentUser && <div className="w-full flex flex-row justify-center">
                    <Link href="/create/team">
                        <Button caption="New Team" style="link" className="w-48" />
                    </Link>
                </div>}
            </LayoutCard>
            <LayoutCard header="Experience">
                {user.experience}
            </LayoutCard>
            <LayoutCard header="Website">
                {user.website && <a href={user.website}>{user.website}</a>}
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