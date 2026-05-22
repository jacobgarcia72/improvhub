import { formatTime } from "@/lib/dates";
import { removeLeadingArticles } from "@/lib/helper-functions";
import { theatres } from "@/lib/theatres";
import { Event } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function EventCard({ event, time, type }: { event: Event, time: string, type: string }) {
    const image = event.image || event.theatre && (
        theatres.find((t) => removeLeadingArticles(t.name) === removeLeadingArticles(event.theatre || ''))
    )?.logo;
    return (
        <Link href={`${type}/${event.id}`}>
            <div className="m-2 w-64 overflow-hidden rounded-3xl border border-slate-300 bg-slate-50/80 shadow-sm shadow-slate-800/10 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="h-30 w-full bg-gray-300">
                    <div className="flex h-full w-full items-center justify-center">
                        {image ? (
                            <Image src={image} alt={event.title} width={120} height={120} className="object-cover h-full w-full" />
                        ) : (
                            <div className="flex h-24 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                                No image available
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-5 pb-1 pt-1">
                    <h2 className="h-7 text-lg text-slate-900 overflow-hidden text-ellipsis">{event.title}</h2>
                    <p className="h-6 text-sm text-slate-500">{event.theatre}</p>
                    <time className="h-7 text-sm text-slate-700">{formatTime(time)}</time>
                    <div className="fade-out text-sm text-slate-900 overflow-hidden text-ellipsis flex flex-wrap gap-2 pt-1 h-28">
                        {event.description || '(No description available)'}
                    </div>
                </div>
            </div>
        </Link>
    )
}