import DistanceSelector from "@/components/distance-select";
import EventCard from "@/components/event-card";
import { getShows } from "@/lib/shows";
import { Suspense } from "react";
import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Shows`,
    description: "Find improv shows near you!",
};

async function ShowList() {
    const shows = await getShows();
    return (
        <div className="flex flex-col px-4 pb-4">
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