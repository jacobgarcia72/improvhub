'use client'
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { useEffect, useState } from 'react';

export default function AddToCalendar() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    // Render a fallback/empty state or return null during SSR
    if (!isMounted) {
        return null; 
    }

    return (
        <AddToCalendarButton
            name="Test-Event"
            startDate="2023-05-22"
            options={['Apple','Google','Yahoo','iCal']}
            timeZone="America/Los_Angeles"
        ></AddToCalendarButton>
    )
}