import { appName } from "@/lib/app-info";
import { getShow } from "@/lib/shows";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { theatres } from "@/lib/theatres";
import Loader from "@/components/loader";
import CoverPhoto from "@/components/cover-photo";

type Props = {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { id } = await params
    const show = await getShow(id);

    return {
        title: show?.title || appName,
        description: show?.description || show?.theatre || 'Show details unavailable'
    }
}

export default async function ShowDetailsLayout({ params, children }: Props) {
    const { id } = await params;
    const show = await getShow(id);

    if (!show) notFound();

    const theatre = theatres.find(t => t.name === show.theatre);
    const imageUrl = show.image || theatre?.image;

    return (
        <Suspense fallback={<Loader />}>
            <section>
                <div className="px-4">
                    <div className="w-full flex flex-row items-center">
                        <div className="w-full">
                            <h1 className="text-2xl">{show.title}</h1>
                            {show.theatre && <h2 className="mb-3">{show.theatre}</h2>}
                        </div>
                    </div>
                    {imageUrl && <CoverPhoto src={imageUrl} alt={show.title} photoCredit={show.photoCredit} />}

                    {children}
                </div>
            </section>
        </Suspense>
    )
}