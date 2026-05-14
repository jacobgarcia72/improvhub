import { appName } from "@/lib/app-info";
import { getShow } from "@/lib/shows";
import { Event } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
  // read route params
    const { id } = await params

  // fetch data
  const show = await getShow(id) as Event | undefined;

  return {
    title: show?.title || appName,
    description: show?.description || show?.theatre || 'Show details unavailable'
  }
}

export default async function ShowDetailsPage({ params }: Props) {
    const { id } = await params;
    const show = await getShow(id) as Event | undefined;

    if (!show) notFound();
    return (
        <Suspense fallback={<p>Loading</p>}>
            <section>
                {show.image && <Image src={show.image} alt={show.title} width={600} height={400} className="w-full h-auto object-cover rounded" />}
                <h1>{show.title}</h1>
                <p>{show.theatre}</p>
                <p>{show.description}</p>
            </section>
        </Suspense>
    )
}