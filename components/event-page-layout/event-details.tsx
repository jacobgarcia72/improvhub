import { getEventOccurrences } from "@/lib/shows";
import { formatDateTimeForDisplay, formatTime, removePastDates, sortDates, weekdays, addDays, formatDate, getWeekdayOccurence, isLastOfMonth } from "@/lib/dates";
import Button from "@/components/form/button";
import { CadenceText, Event, EventType } from "@/types";
import Link from "next/link";
import OccurrenceSelection from "./occurrence-selection";
import { capitalize, pluralize } from "@/lib/helper-functions";

function P({ children, className }: { children: React.ReactNode, className?: string }) {
    return children ? <p className={`mb-4 mt-2 ${className}`}>{children}</p> : null;
}

function Header({ children }: { children: React.ReactNode }) {
    return children ? <h3 className="mt-3 font-semibold text-sm">{children}</h3> : null;
}

export default async function EventDetails({ event, type }: {
    event: Event,
    type: EventType
}) {
    const occurrences = await getEventOccurrences(event.id, type);
    const isASeries = occurrences.length > 1 || event.recurringTime;
    const dateTimes = occurrences.map(({ dateTime }) => dateTime);
    let futureEvents: string[] = [];
    if (dateTimes) {
        futureEvents = removePastDates(
            sortDates(dateTimes)
        ).slice(0, 52);
    }

    let recurringSchedule = null;
    if ((event.recurringDay || event.recurringDay === 0) && event.cadence) {
        const day = weekdays[Number(event.recurringDay)];
        let text = CadenceText[event.cadence].replace('X', day);
        if (event.recurringTime) text += ` at ${formatTime(event.recurringTime)}`;
        recurringSchedule = text;
        // Generate next 4 dates based on recurringDay and cadence
        let currentDate = new Date();
        const cadenceOrdinals = event.cadence === 'last' ? [] : event.cadence.split('').map(Number);
        while (futureEvents.length < 52) {
            if (currentDate.getDay() === Number(event.recurringDay)) {
                const occurrence = getWeekdayOccurence(currentDate);
                const isMatch = event.cadence === 'last' ? isLastOfMonth(currentDate) : cadenceOrdinals.includes(occurrence);
                if (isMatch) {
                    let dateTimeStr = formatDate(currentDate);
                    if (event.recurringTime) {
                        dateTimeStr += ` ${event.recurringTime}`;
                    }
                    futureEvents.push(dateTimeStr);
                }
            }
            currentDate = addDays(currentDate, 1);
        }
    }

    let ticketInfo = null;
    if ('price' in event && event.price !== null) {
        ticketInfo = `$${event.price}`;
        if ('doorPrice' in event && event.doorPrice !== null && event.doorPrice !== event.price) {
            ticketInfo += ` ($${event.doorPrice} at the door)`;
        }
    }

    let runtime: string = '';
    if (event.runtime) {
        const [hours, minutes] = event.runtime.split('h');
        if (hours && hours !== '0') runtime += `${hours} hour${hours !== '1' ? 's' : ''}`;
        if (minutes && minutes !== '0') runtime += ` ${minutes} minute${minutes !== '1' ? 's' : ''}`;
    }

    return (
        <div className="pb-2">
            {event.description?.split('<br>').map((line, i) => <P key={i}>{line}</P>)}
            <div className="flex flex-row flex-wrap gap-2">
                {isASeries && (
                    <div className="grow-2 min-w-[200px]">
                        {recurringSchedule && <Header>{capitalize(type)} Schedule:</Header>}
                        <P>{recurringSchedule}</P>
                        {futureEvents.length ? <>
                            <Header>Upcoming {capitalize(type)} Dates:</Header>
                            <ul className="mt-2">
                                {futureEvents.slice(0, 4).map((date, i) => (
                                    <Link key={i} href={`/${pluralize(type)}/${event.id}/${date}`}>
                                        <li className="no-bullets link ">
                                            {formatDateTimeForDisplay(date)}
                                        </li>
                                    </Link>
                                ))}
                            </ul>
                        </> : null}
                        {futureEvents.length > 4 && (
                            <OccurrenceSelection
                                eventId={event.id}
                                dateTimes={futureEvents}
                                type={type}
                            />
                        )}
                    </div>
                )}
                <div className="grow-1 min-w-[200px]">
                    {runtime && <Header>Approximate runtime:</Header>}
                    <P>{runtime}</P>
                    {ticketInfo && <Header>Ticket Price:</Header>}
                    <P>{ticketInfo}</P>
                    {('ticketsUrl' in event && event.ticketsUrl) ? (
                        <a href={event.ticketsUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="w-54" caption="Get Tickets" />
                        </a>
                    ) : null}
                </div>
            </div>
            {('notes' in event && event.notes) ? <footer className="text-xs mt-4">{event.notes}</footer> : null}
        </div>
    )
}