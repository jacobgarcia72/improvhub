import { Metadata } from "next";
import { appName } from "@/lib/app-info";
import { getCurrentUser, getUserRoles } from "@/lib/users";
import Link from "next/link";
import Button from "@/components/form/button";
import { notFound } from "next/navigation";
import { capitalize, singularize } from "@/lib/helper-functions";
import { Suspense } from "react";
import Loader from "@/components/loader";
import { getEventsByAdmin, getUpcomingShowsByCastMember } from "@/lib/shows";
import { Event, EventType, Role } from "@/types";
import { getTeamsByUser } from "@/lib/teams";
import MiniCard from "@/components/mini-card";
import ShowsLookingFor from "./shows-looking-for";
import UpcomingShows from "@/components/upcoming-shows";
import RSVPEvents from "./rsvp-events";

export async function generateMetadata(
    { params }: { params: Promise<{ events: string }> },
): Promise<Metadata> {
    const { events } = await params;
    if (!['shows', 'jams', 'classes', 'workshops'].includes(events)) {
        return {};
    }
    return {
        title: `${capitalize(events)} | ${appName}`,
        description: `Find and create improv ${events} on ${appName}.`,
    };
}

export default async function EventsPage({ params }: { params: Promise<{ events: string }> }) {
    const { events } = await params;
    const type = singularize(events) as EventType;
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        notFound();
    }
    const user = await getCurrentUser();
    const userId = user?.id;

    const eventsManaged = userId ? await getEventsByAdmin(userId, type) : null;

    const showsUserIsIn = (type === 'show' && userId) ? await getUpcomingShowsByCastMember(userId) : null;
    const showsByDate: { dateTime: string, show: Event }[] = [];
    showsUserIsIn?.forEach(({ show, dateTimes }) => {
        dateTimes.forEach((dateTime) => {
            showsByDate.push({ dateTime, show });
        })
    });
    showsByDate.sort((a, b) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    const roles = (type === 'show' && userId) ? await getUserRoles(userId) : null;
    const isOnATeam = (type === 'show' && userId) ? (await getTeamsByUser(userId)).length > 0 : null;

    return (
        <>
            <section className="flex flex row gap-2">
                <Link href={`/create/${type}`}>
                    <Button caption={`New ${capitalize(type)}`} />
                </Link>
                <Link href={`/search?for=${events}`}>
                    <Button caption={`Find ${capitalize(events)}`} />
                </Link>
            </section>
            <Suspense fallback={<Loader />}>
                {eventsManaged?.length ? (
                    <section>
                        <h2 className="text-slate-700 dark:text-slate-300">{capitalize(events)} I Manage</h2>
                        <div className="flex flex-row flex-wrap">
                            {eventsManaged.map((event, i) => <MiniCard key={i} item={event} type={type} />)}
                        </div>
                    </section>
                ) : null}
            </Suspense>
            {type === 'show' && <>
                <Suspense fallback={<Loader />}>
                    {userId ? <UpcomingShows includeTeams label="Shows I'm In" id={userId} /> : null}
                </Suspense>
            </>}
            <Suspense fallback={<Loader />}>
                {userId ? <RSVPEvents userId={userId} type={type} /> : null}
            </Suspense>
            {type === 'show' && <>
                {user && roles ? Object.keys(roles).filter((key) => roles[key]).map((role) => (
                    <ShowsLookingFor key={role} role={role as Role} limit={24} user={user} />
                )) : null}
                {user && isOnATeam ? (
                    <ShowsLookingFor key='team' role='team' limit={24} user={user} />
                ) : null}
            </>}
            {!user && <section className="min-h-32 flex flex-col items-center justify-center gap-2">
                <p className="mb-2"><Link className="link" href="/login">Sign in</Link> to create and manage improv {events}!</p>
            </section>}
        </>
    )
}