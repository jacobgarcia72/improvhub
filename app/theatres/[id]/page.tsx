import Loader from "@/components/loader";
import UpcomingShows from "./upcoming-shows";
import { pluralize } from "@/lib/helper-functions";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId, getFollowCount } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Button from "@/components/form/button";

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
    const followerCount = await getFollowCount(id, 'theatre');

    const userId = await getCurrentUserId();
    const canManage = !theatre.admins?.length || (
        userId && theatre.admins.includes(userId)
    );
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
                {canManage ? (
                    <Link href={`/manage/theatre/${id}`}>
                        <Button caption="Edit Theatre" className="w-54 mb-3" />
                    </Link>
                ): null}
                <div className="px-7 flex flex-col gap-1">
                    <div>
                        {address ? <p className="text-slate-700">{address}</p> : null}
                        {location ? <p className="text-slate-700">{location}</p> : null}
                    </div>
                    {website && <a className="link" target="_blank" href={website}>{website}</a>}
                </div>
            </section>
            <UpcomingShows theatre={theatre} />
        </Suspense>
    );
}