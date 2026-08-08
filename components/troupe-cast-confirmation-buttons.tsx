'use client';

import { useState } from "react";
import Button from "@/components/form/button";
import { setTroupeCastConfirmation } from "@/lib/shows";

export default function TroupeCastConfirmationButtons({
    troupeId,
    showId,
    dateTime,
    initialConfirmed
}: {
    troupeId: string,
    showId: string,
    dateTime: string,
    initialConfirmed: boolean | null
}) {
    const [confirmed, setConfirmed] = useState<boolean | null>(initialConfirmed);
    const [pending, setPending] = useState(false);

    const handleClick = async (nextConfirmed: boolean) => {
        setPending(true);
        await setTroupeCastConfirmation(troupeId, showId, dateTime, nextConfirmed);
        setConfirmed(nextConfirmed);
        setPending(false);
    };

    return (
        <div>
            <p>Confirm if you can make it:</p>
            <div className="flex flex-row flex-wrap gap-2 items-center pt-1">
                <Button
                    disabled={pending}
                    onClick={() => handleClick(true)}
                    caption="Yes"
                    className={`small ${confirmed === true ? 'green' : ''}`}
                />
                <Button
                    disabled={pending}
                    onClick={() => handleClick(false)}
                    caption="No"
                    className={`small ${confirmed === false ? 'red' : 'dark'}`}
                />
                {confirmed === true ? <p className="text-sm text-green-700 dark:text-green-300">Confirmed</p> : null}
                {confirmed === false ? <p className="text-sm text-red-700 dark:text-red-300">Marked unavailable</p> : null}
            </div>
        </div>
    )
}
