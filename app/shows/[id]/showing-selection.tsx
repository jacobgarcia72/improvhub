'use client'
import { formatDateTimeForDisplay } from "@/lib/dates"
import { useRouter } from "next/navigation"

export default function ShowingSelection({ dateTimes, showId }: {
    dateTimes: string[],
    showId: string
}) {
    const router = useRouter()
    const handleDateSelection = (dateTime: string) => {
        if (dateTime) {
            router.push(`/shows/${showId}/${dateTime}/`, { scroll: true });
        }
    }
    return <>
        <select
            id="date-select"
            name="date-select"
            className="border border-gray-300 rounded px-3 py-2 mt-1 w-3/4 min-w-[200px]"
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