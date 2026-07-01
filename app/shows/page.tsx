import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/form/button";
import { getCurrentUser, getUserRoles } from "@/lib/users";
import { getShowsByAdmin, getUpcomingShowsByCastMember } from "@/lib/shows";
import MiniCard from "@/components/mini-card";
import { Event, Role } from "@/types";
import UserShows from "@/components/upcoming-shows";
import { Suspense } from "react";
import Loader from "@/components/loader";
import ShowsLookingFor from "./shows-looking-for";
import { getTeamsByUser } from "@/lib/teams";


export const metadata: Metadata = {
    title: `Improv Shows | ${appName}`
};

export default async function ShowsPage() {
    const user = await getCurrentUser();
    const userId = user?.id;
    const showsManaged = userId ? await getShowsByAdmin(userId) : null;
    const showsUserIsIn = userId ? await getUpcomingShowsByCastMember(userId) : null;
    const showsByDate: { dateTime: string, show: Event }[] = [];
    showsUserIsIn?.forEach(({ show, dateTimes }) => {
        dateTimes.forEach((dateTime) => {
            showsByDate.push({ dateTime, show });
        })
    });
    showsByDate.sort((a, b) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    const roles = userId ? await getUserRoles(userId) : null;
    const isOnATeam = userId ? (await getTeamsByUser(userId)).length > 0 : null;
    return (
        <>
            <section className="flex flex row gap-2">
                <Link href="/create/show">
                    <Button caption="New Show" />
                </Link>
                <Link href="/search?for=shows">
                    <Button caption="Find Shows" />
                </Link>
            </section>
            <Suspense fallback={<Loader />}>
                {showsManaged?.length ? (
                    <section>
                        <h2 className="text-slate-700 font-semibold">Shows I Manage</h2>
                        <div className="flex flex-row flex-wrap">
                            {showsManaged.map((show, i) => <MiniCard key={i} item={show} type="show" />)}
                        </div>
                    </section>
                ) : null}
            </Suspense>
            <Suspense fallback={<Loader />}>
                {userId ? <UserShows includeTeams label="Shows I'm In" id={userId} /> : null}
            </Suspense>
            {user && roles ? Object.keys(roles).filter((key) => roles[key]).map((role) => (
                <ShowsLookingFor key={role} role={role as Role} limit={24} user={user} />
            )) : null}
            {user && isOnATeam ? (
                <ShowsLookingFor key='team' role='team' limit={24} user={user} />
            ) : null}
            {!user && <section className="min-h-32 flex flex-col items-center justify-center gap-2">
                <p className="mb-2"><Link className="link" href="/login">Sign in</Link> to create, manage, and get cast in improv shows!</p>
            </section>}
        </>
    )
}