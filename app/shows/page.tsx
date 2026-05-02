import DistanceSelector from "@/components/distance-select";
import EventCard from "@/components/event-card";
import { getShows } from "@/lib/shows";
import { Suspense } from "react";
import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: `${appName} | Shows`,
    description: "Find improv shows near you!",
};

async function ShowList() {
    const shows = await getShows();
    return (
        <div className="flex flex-col px-4 pb-4">
            {shows.map(show => (
                <EventCard key={show.id} event={show} href={`/shows/${show.id}`} />
            ))}
        </div>
    )
}

export default function ShowsPage() {

    return (
        <main>
            <section className="flex flex-row items-center justify-between px-6 py-3">
                <Link href="/shows/new" className="text-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-1 px-4 rounded transition-colors">
                    Post a Show
                </Link>
                <DistanceSelector label="Shows" />
            </section>
            <section>
                <Suspense fallback={<p>Loading shows...</p>}>
                    <ShowList />
                </Suspense>
            </section>
        </main>
    )
}