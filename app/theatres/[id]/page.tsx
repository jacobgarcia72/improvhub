import Loader from "@/components/loader";
import { pluralize } from "@/lib/helper-functions";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId, getFollowCount } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/form/button";
import EventResults from "@/app/search/event-results";

export default async function TheatreDetailsPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
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
    const canManage = userId && (
        !theatre.admins?.length || theatre.admins.includes(userId)
    );
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
                    <div>
                        {address ? <p className="text-slate-700 dark:text-slate-300">{address}</p> : null}
                        {location ? <p className="text-slate-700 dark:text-slate-300">{location}</p> : null}
                    </div>
                    {website && <a className="link" target="_blank" href={website}>{website}</a>}
                </div>
                {canManage ? (
                    <Link href={`/manage/theatre/${id}`}>
                        <Button caption="Edit Theatre" className="w-54 mt-3" />
                    </Link>
                ): null}
            </section>
            <section>
                <h3 className="ml-8 mb-2">Upcoming Events:</h3>
                <EventResults showTheatre={false} limit={14} theatre={id} />
            </section>
        </Suspense>
    );
}