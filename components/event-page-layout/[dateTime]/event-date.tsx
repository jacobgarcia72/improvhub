import { formatDateTimeForDisplay } from "@/lib/dates";
import { capitalize } from "@/lib/helper-functions";
import { EventType } from "@/types";

export default function EventDate({ eventDate, type }: { eventDate: string, type: EventType }) {
    return (
        <h3 className="font-semibold font-lg pt-2 pb-0">{`${capitalize(type)} Date: ${formatDateTimeForDisplay(eventDate)}`}</h3>
    )
}