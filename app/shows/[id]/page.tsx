import { appName } from "@/lib/app-info";
import { getShow } from "@/lib/shows";
import { CadenceText, Event } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { theatres } from "@/lib/theatres";
import { formatTime, weekdayInitials, weekdays } from "@/lib/dates";
import Button from "@/components/form/button";

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

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

export default async function ShowDetailsPage({ params }: Props) {
    const { id } = await params;
    const show = await getShow(id) as Event | undefined;

    if (!show) notFound();

    const theatre = theatres.find(t => t.name === show.theatre);
    const imageUrl = show.image || theatre?.logo;

    let dates: string[] | null = null;
    let times: string[] | null = null;

    if (show.dates) dates = show.dates.split(',');
    if (show.times) times = show.times.split(',');

    const getRecurringSchedule = (): string | null => {
        if (show.recurringDay && show.cadence) {
            const dayIndex = weekdayInitials.indexOf(show.recurringDay);
            const day = weekdays[dayIndex];
            let text = CadenceText[show.cadence].replace('X', day);
            if (show.times) text += ` at ${formatTime(show.times)}`;
            return `${text}!`;
        }
        return null;
    }

    let ticketInfo = null;
    if (show.price !== null) {
        ticketInfo = show.price ? `Tickets: $${show.price}` : 'Free show';
        if (show.doorPrice !== null && show.doorPrice !== show.price) {
            ticketInfo += ` (${show.doorPrice} at the door)`;
        }
    }

    return (
        <Suspense fallback={<p>Loading</p>}>
            <section>
                <div className="px-4">
                    <div className="flex flex-row">
                        <div className="w-full">
                            <h1 className="text-2xl">{show.title}</h1>
                            {show.theatre && <h2 className="mb-3">{show.theatre}</h2>}
                        </div>
                        <div className="w-50 flex items-center justify-end pr-2 pb-3">
                            {show.webpage && (
                                <a href={show.webpage} target="_blank" rel="noopener noreferrer">
                                    <Button type="button" caption="Show Page" />
                                </a>
                            )}
                        </div>
                    </div>
                    {imageUrl && <>
                        <Image src={imageUrl} alt={show.title} width={600} height={400} className="w-full h-72 object-cover rounded" />
                        <P className="italic text-sm">{show.photoCredit && `Photo Credit: ${show.photoCredit}`}</P>
                    </>}
                    {show.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                    <P>{getRecurringSchedule()}</P>
                    {dates && <P>{`Show date${dates.length > 1 && 's'}:`}</P>}
                    {dates?.map((date, i) => (
                        <P key={i}>{date}{times?.[i] && ` at ${formatTime(times[i])}`}</P>
                    ))}
                    <P>{show.runtime && `Approximate runtime: ${show.runtime}`}</P>
                    <P>{ticketInfo}</P>
                    {show.notes && <footer className="text-xs mt-4">{show.notes}</footer>}
                </div>
            </section>
        </Suspense>
    )
}