import { getShowings } from "@/lib/shows";
import { formatDateTimeForDisplay, formatTime, removePastDates, sortDates, weekdays, addDays, formatDate, getWeekdayOccurence, isLastOfMonth } from "@/lib/dates";
import Button from "@/components/form/button";
import { CadenceText, Event } from "@/types";
import Link from "next/link";
import ShowingSelection from "./showing-selection";

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-3 font-semibold text-sm">{children}</h3> : null;
}

export default async function ShowDetails({ show }: {
    show: Event
}) {
    const showings = await getShowings(show.id);
    const dateTimes = showings.map(({ dateTime }) => dateTime);
    let futureShows: string[] = [];
    if (dateTimes) {
        futureShows = removePastDates(
            sortDates(dateTimes)
        ).slice(0, 52);
    }

    let recurringSchedule = null;
    if ((show.recurringDay || show.recurringDay === 0) && show.cadence) {
        const day = weekdays[Number(show.recurringDay)];
        let text = CadenceText[show.cadence].replace('X', day);
        if (show.recurringTime) text += ` at ${formatTime(show.recurringTime)}`;
        recurringSchedule = text;
        // Generate next 4 dates based on recurringDay and cadence
        let currentDate = new Date();
        const cadenceOrdinals = show.cadence === 'last' ? [] : show.cadence.split('').map(Number);
        while (futureShows.length < 52) {
            if (currentDate.getDay() === Number(show.recurringDay)) {
                const occurrence = getWeekdayOccurence(currentDate);
                const isMatch = show.cadence === 'last' ? isLastOfMonth(currentDate) : cadenceOrdinals.includes(occurrence);
                if (isMatch) {
                    let dateTimeStr = formatDate(currentDate);
                    if (show.recurringTime) {
                        dateTimeStr += ` ${show.recurringTime}`;
                    }
                    futureShows.push(dateTimeStr);
                }
            }
            currentDate = addDays(currentDate, 1);
        }
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
        <div className="pb-2">
            {show.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
            <div className="flex flex-row flex-wrap">
                <div className="w-1/2 min-w-[200px]">
                    {recurringSchedule && <Header>Show Schedule:</Header>}
                    <P>{recurringSchedule}</P>
                    {futureShows?.length > 1 && <Header>Upcoming Shows</Header>}
                    {futureShows?.length === 1 && <Header>Show Date</Header>}
                    {futureShows.length ? <ul className="mt-2">
                        {futureShows.slice(0, 4).map((date, i) => (
                            <Link key={i} href={`/shows/${show.id}/${date}`}>
                                <li className="no-bullets link ">
                                    {formatDateTimeForDisplay(date)}
                                </li>
                            </Link>
                        ))}
                    </ul> : null}
                    {futureShows.length > 4 && (
                        <ShowingSelection
                            showId={show.id}
                            dateTimes={futureShows}
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
                            <Button className="w-54" caption="Get Tickets" />
                        </a>
                    )}
                </div>
            </div>
            {show.notes && <footer className="text-xs mt-4">{show.notes}</footer>}
        </div>
    )
}