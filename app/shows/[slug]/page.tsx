"use client";
import { getShow } from "@/lib/shows";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowDetailsPage({ params }: { params: { slug: string } }) {
    
    const [showId, setShowId] = useState<string | null>(null);
    useEffect(() => {
        const fetchParams = async () => {
            const resolvedParams = await params;
            setShowId(resolvedParams.slug);
        }
        fetchParams();
    }, [params]);
    const show = showId ? getShow(showId) : undefined;
    if (show === undefined) {
        return (
            <p>Loading...</p>
        )
    } else if (show === null) {
        notFound();
    }
    return (
        <section>
            {show.imageUrl && <Image src={show.imageUrl} alt={show.title} width={600} height={400} className="w-full h-auto object-cover rounded" />}
            <h1>{show.title}</h1>
            <p>{show.description}</p>
        </section>
    )
}