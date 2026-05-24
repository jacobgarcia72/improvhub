import DistanceSelect from "@/components/form/distance-select";
// import EventCard from "@/components/event-card";
// import { getShowsByTheatre } from "@/lib/shows";
// import { Suspense } from "react";
import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/form/button";


export const metadata: Metadata = {
    title: `${appName} | Shows`,
    description: "Find improv shows near you!",
};

// async function ShowList() {
//     const shows = await getShows();
//     return (
//         <div className="flex flex-col px-4 pb-4">
//             {shows.map(show => (
//                 <EventCard key={show.id} event={show} href={`/shows/${show.id}`} />
//             ))}
//         </div>
//     )
// }

export default function ShowsPage() {

    return (
        <>
            <section className="flex flex-row items-center justify-between px-6 py-3 gap-2">
                <Link href="/create/show">
                    <Button type="button" caption="Post a Show" />
                </Link>
                <DistanceSelect />
            </section>
            {/* <section>
                <Suspense fallback={<p>Loading shows...</p>}>
                    <ShowList />
                </Suspense>
            </section> */}
        </>
    )
}