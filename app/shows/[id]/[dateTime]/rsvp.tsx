'use client'
import { setRsvpStatus } from "@/lib/shows";
import { useState } from "react";

export default function RSVP({ showId, showDate, userId, rsvp }: {
    showId: string,
    showDate: string,
    userId: string,
    rsvp: string | null
}) {
    const [pending, setPending] = useState(false);

    const handleRsvp = async (value: string) => {
        setPending(true);
        await setRsvpStatus(userId, showId, showDate, value);
        setPending(false);
    }

    return (
        <div className="min-w-[140px] max-w-[200px] mb-1">
            <select
                id="rsvp"
                name="rsvp"
                value={rsvp || ''}
                disabled={pending}
                className="cursor-pointer w-full border border-gray-300 rounded px-3 py-2"
                onChange={(e) => handleRsvp(e.target.value)}
            >
                <option value="">RSVP</option>
                <option value="g">Going</option>
                <option value="i">Interested</option>
                <option value="n">Not Going</option>
            </select>
        </div>
    )
}