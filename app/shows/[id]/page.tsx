import { appName } from "@/lib/app-info";
import { getShow, getShowingsForEvent } from "@/lib/shows";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { theatres } from "@/lib/theatres";
import { formatDateTimeForDisplay, formatTime, removePastDates, sortDates, weekdays } from "@/lib/dates";
import Button from "@/components/form/button";
import { optimizeImage } from "@/lib/cloudinary";
import Loader from "@/components/loader";
import { CadenceText } from "@/types";

type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    // read route params
        const { id } = await params

    // fetch data
    const show = await getShow(id);

    return {
        title: show?.title || appName,
        description: show?.description || show?.theatre || 'Show details unavailable'
    }
}

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-3 font-semibold text-sm">{children}</h3> : null;
}

export default async function ShowDetailsPage({ params }: Props) {
    const { id } = await params;
    const show = await getShow(id);

    if (!show) notFound();

    const theatre = theatres.find(t => t.name === show.theatre);
    const imageUrl = show.image || theatre?.image;

    const showings = await getShowingsForEvent(id);
    const dateTimes = showings.map(({ dateTime }) => dateTime);
    let upcomingShows: string[] = [];
    if (dateTimes) {
        upcomingShows = removePastDates(
            sortDates(dateTimes)
        ).slice(0, 4);
    }

    let recurringSchedule = null;
    if (typeof show.recurringDay === 'number' && show.cadence) {
        const day = weekdays[show.recurringDay];
        let text = CadenceText[show.cadence].replace('X', day);
        if (show.recurringTime) text += ` at ${formatTime(show.recurringTime)}`;
        recurringSchedule = text;
    }


    let ticketInfo = null;
    if (show.price !== null) {
        ticketInfo = `$${show.price}`;
        if (show.doorPrice !== null && show.doorPrice !== show.price) {
            ticketInfo += ` ($${show.doorPrice} at the door)`;
        }
    }

    let runtime: string = '';
    if (show.runtime) {
        const [hours, minutes] = show.runtime.split('h');
        if (hours && hours !== '0') runtime += `${hours} hour${hours !== '1' ? 's' : ''}`;
        if (minutes && minutes !== '00') runtime += ` ${minutes} minute${minutes !== '1' ? 's' : ''}`;
    }

    return (
        <Suspense fallback={<Loader />}>
            <section>
                <div className="px-4">
                    <div className="w-full">
                        <h1 className="text-2xl">{show.title}</h1>
                        {show.theatre && <h2 className="mb-3">{show.theatre}</h2>}
                    </div>
                    {imageUrl && <>
                        <Image src={optimizeImage(imageUrl, 600, null, 80)}
                            alt={show.title}
                            width={600}
                            height={400}
                            className="mt-2 w-full h-auto min-h-18 max-h-[90vh] h-72 object-cover rounded"
                        />
                        <P className="italic text-sm">{show.image && show.photoCredit && `Photo Credit: ${show.photoCredit}`}</P>
                    </>}
                    {show.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                    <div className="flex flex-row flex-wrap">
                        <div className="w-1/2">
                            {recurringSchedule && <Header>Show Schedule:</Header>}
                            <P>{recurringSchedule}</P>
                            {upcomingShows?.length > 1 && <Header>Upcoming Shows</Header>}
                            {upcomingShows?.length === 1 && <Header>Show Date</Header>}
                            {upcomingShows && <ul className="mt-2">
                                {upcomingShows.map((date, i) => (
                                    <li key={i} className="no-bullets">{formatDateTimeForDisplay(date)}</li>
                                ))}
                            </ul>}
                        </div>
                        <div className="w-1/2">
                            {runtime && <Header>Approximate runtime:</Header>}
                            <P>{runtime}</P>
                            {ticketInfo && <Header>Ticket Price:</Header>}
                            <P>{ticketInfo}</P>
                            {show.ticketsUrl && (
                                <a href={show.ticketsUrl} target="_blank" rel="noopener noreferrer">
                                    <Button caption="Get Tickets" />
                                </a>
                            )}
                        </div>
                    </div>
                    {show.notes && <footer className="text-xs mt-4">{show.notes}</footer>}
                </div>
            </section>
        </Suspense>
    )
}