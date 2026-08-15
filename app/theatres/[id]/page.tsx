import Loader from "@/components/loader";
import { pluralize } from "@/lib/helper-functions";
import { canDeleteTheatre, canManageTheatre, getTheatre } from "@/lib/theatres";
import { getCurrentUserId, getFollowCount } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/form/button";
import EventResults from "@/app/search/event-results";
import { isDev } from "@/lib/app-info";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DeleteTheatre from "./delete-theatre";

const DEFAULT_EVENT_DAYS = 5;

export default async function TheatreDetailsPage({ params, searchParams }: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ limit?: string }>;
}) {
    const { id } = await params;
    const query = await searchParams;
    const limit = Number(query.limit);
    const eventDays = Number.isNaN(limit) || limit < 1 ? DEFAULT_EVENT_DAYS : limit;
    const theatre = await getTheatre(id);

    if (!theatre) notFound();

    const { city, state, address, zipcode, website } = theatre;
    let location = city || '';
    if (state) location = city ? `${city} ${state}` : state;
    if (zipcode) {
        if (location) location += ' ';
        location += zipcode;
    }

    const userId = await getCurrentUserId();
    const hasAdmins = Boolean(theatre.admins?.length);
    const canManage = canManageTheatre(theatre, userId);
    const canDelete = canDeleteTheatre(theatre, userId);
    const followerCount = userId ? await getFollowCount(id, 'theatre') : null;
    return (
        <Suspense fallback={<Loader />}>
            {followerCount ? (
                <section>
                    <Link href={`/theatres/${id}/followers`} className="link ml-8">
                        {`${followerCount} ${pluralize('Follower', followerCount)}`}
                    </Link>
                </section>
            ) : null}
            <section>
                <div className="px-7 flex flex-col gap-1">
                    {isDev && <Link className="link mb-2" href={`/discuss?channel=theatre-${id}`}>
                        <FontAwesomeIcon icon={faMessage} /> Theatre Discussion Channel
                    </Link>}
                    <div>
                        {address ? <p className="text-slate-700 dark:text-slate-300">{address}</p> : null}
                        {location ? <p className="text-slate-700 dark:text-slate-300">{location}</p> : null}
                    </div>
                    {website && <a className="link" target="_blank" href={website}>{website}</a>}
                </div>
                {canManage ? (
                    <div className="mt-3 ml-5 flex flex-row flex-wrap gap-2">
                        <Link href={`/manage/theatre/${id}`}>
                            <Button caption="Edit Theatre" className="w-54" />
                        </Link>
                        {hasAdmins ? (
                            <Link href={`/theatres/${id}/admins`}>
                                <Button caption="Manage Admins" className="w-54" />
                            </Link>
                        ) : null}
                        {!hasAdmins ? (
                            <Link href={userId ? `/theatres/${id}/claim` : `/login?reroute=theatres%2F${id}%2Fclaim`}>
                                <Button caption="Claim Theatre" className="w-54" />
                            </Link>
                        ) : null}
                    </div>
                ): null}
            </section>
            <section>
                <h3 className="ml-8 mb-2">Upcoming Events:</h3>
                <EventResults
                    showTheatre={false}
                    limit={eventDays}
                    theatre={id}
                    searchParams={query}
                    resultsPath={`/theatres/${id}`}
                />
            </section>
            {canDelete ? (
                <DeleteTheatre theatreId={theatre.id} theatreName={theatre.name} />
            ) : null}
        </Suspense>
    );
}
