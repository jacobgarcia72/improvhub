import DistanceSelector from "@/components/distance-select";
import EventCard from "@/components/event-card";
import { getShows } from "@/lib/shows";
import { Suspense } from "react";

async function ShowList() {
    const shows = await getShows();
    return (
        <div className="flex flex-col">
            {shows.map(show => (
                <EventCard key={show.id} event={show} />
            ))}
        </div>
    )
}

export default function ShowsPage() {

    return (
        <>
            <DistanceSelector label="Shows" />
            <section>
                <Suspense fallback={<p>Loading shows...</p>}>
                    <ShowList />
                </Suspense>
            </section>
        </>
    )
}