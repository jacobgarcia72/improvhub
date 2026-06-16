import { appName } from "@/lib/app-info";
import { getShow, getShowings } from "@/lib/shows";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from 'next'
import { theatres } from "@/lib/theatres";
import { formatDateTimeForDisplay, formatTime, removePastDates, sortDates, weekdays } from "@/lib/dates";
import Button from "@/components/form/button";
import Loader from "@/components/loader";
import { CadenceText } from "@/types";
import Link from "next/link";
import CoverPhoto from "@/components/cover-photo";
import ShowingSelection from "./showing-selection";

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

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-3 font-semibold text-sm">{children}</h3> : null;
}

export default async function ShowDetailsLayout({ params, children }: Props) {
    const { id } = await params;
    const show = await getShow(id);

    if (!show) notFound();

    const theatre = theatres.find(t => t.name === show.theatre);
    const imageUrl = show.image || theatre?.image;

    const showings = await getShowings(id);
    const dateTimes = showings.map(({ dateTime }) => dateTime);
    let upcomingShows: string[] = [];
    if (dateTimes) {
        upcomingShows = removePastDates(
            sortDates(dateTimes)
        ).slice(0, 4);
    }

    let recurringSchedule = null;
    if ((show.recurringDay || show.recurringDay === 0) && show.cadence) {
        const day = weekdays[Number(show.recurringDay)];
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
        if (minutes && minutes !== '0') runtime += ` ${minutes} minute${minutes !== '1' ? 's' : ''}`;
    }

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

                    {show.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
                    <div className="flex flex-row flex-wrap">
                        <div className="w-1/2 min-w-[200px]">
                            {recurringSchedule && <Header>Show Schedule:</Header>}
                            <P>{recurringSchedule}</P>
                            {upcomingShows?.length > 1 && <Header>Upcoming Shows</Header>}
                            {upcomingShows?.length === 1 && <Header>Show Date</Header>}
                            {upcomingShows && <ul className="mt-2">
                                {upcomingShows.map((date, i) => (
                                    <Link key={i} href={`/shows/${id}/${date}`}>
                                        <li className="no-bullets link ">
                                            {formatDateTimeForDisplay(date)}
                                        </li>
                                    </Link>
                                ))}
                            </ul>}
                            {showings.length > upcomingShows.length && (
                                <ShowingSelection
                                    showId={id}
                                    dateTimes={showings.map((showing) => showing.dateTime)}
                                />
                            )}
                        </div>
                        <div className="w-1/2 min-w-[200px]">
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