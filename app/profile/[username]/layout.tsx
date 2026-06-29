import Loader from "@/components/loader";
import { isSignedIn, verifyAuth } from "@/lib/auth";
import { getFriendship, getUser, getUserRoles } from "@/lib/users";
import { User } from "@/types";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import UserDetails from "./user-details";
import UserOptions from "./user-options";
import FriendsButton from "@/components/friends-button";

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

export default async function UserProfilePage({ params, children }: { params: Promise<{username: string}>, children: React.ReactNode }) {

    const { username } = await params;
    const user = await getUser(username) as User | undefined;
    if (!user) notFound();

    if (!(await isSignedIn())) {
        redirect(`/login?reroute=profile%2F${username}`);
    }

    const currentUserId = (await verifyAuth()).user?.id;
    const isCurrentUser = username === currentUserId;
    const userRoles = (await getUserRoles(username)) ?? undefined;

    const friendship = isCurrentUser ? null : await getFriendship(currentUserId, username);

    return (
        <Suspense fallback={<Loader />}>
            <LayoutCard className="relative">
                {!isCurrentUser && <div className="absolute right-5 top-3">
                    <FriendsButton
                        yourId={currentUserId}
                        theirId={username}
                        friends={friendship?.accepted || false}
                        youSentRequest={friendship?.user1Id === currentUserId}
                        theySentRequest={friendship?.user1Id === username}
                    />
                </div>}
                {isCurrentUser ? (
                    <UserOptions user={user} userRoles={userRoles} />
                ) : <UserDetails user={user} userRoles={userRoles} />}
            </LayoutCard>
            {children}
        </Suspense>
    )
}