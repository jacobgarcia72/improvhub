'use client'
import { formatDateTimeForDisplay } from "@/lib/dates"
import { pluralize } from "@/lib/helper-functions"
import { EventType } from "@/types"
import { useRouter } from "next/navigation"

export default function OccurrenceSelection({ dateTimes, eventId, type }: {
    dateTimes: string[],
    eventId: string,
    type: EventType
}) {
    const router = useRouter()
    const handleDateSelection = (dateTime: string) => {
        if (dateTime) {
            router.push(`/${pluralize(type)}/${eventId}/${dateTime}/`, { scroll: true });
        }
    }
    return <>
        <select
            id="date-select"
            name="date-select"
            className="cursor-pointer border border-gray-300 rounded px-3 py-2 mt-1 w-3/4 min-w-[200px]"
            onChange={(e) => handleDateSelection(e.target.value)}
        >
        <option value="">More dates...</option>
        {dateTimes.map((dateTime) => (
            <option key={dateTime} value={dateTime}>
                {formatDateTimeForDisplay(dateTime)}
            </option>
        ))}
        </select>
    </>
}