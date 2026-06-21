'use client'
import { getEndDateAndTimeFromRuntime } from '@/lib/dates';
import { Event } from '@/types';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import { useEffect, useState } from 'react';

export default function AddToCalendar({ show, date, location }: { show: Event, date: string, location?: string }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    // Render a fallback/empty state or return null during SSR
    if (!isMounted) {
        return null; 
    }
    const [startDate, startTime] = date.split(' ');
    const [endDate, endTime] = getEndDateAndTimeFromRuntime(startDate, startTime, show.runtime);
    const timezone =  Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (
        <AddToCalendarButton
            name={show.title}
            description={show.description || undefined}
            timeZone={timezone}
            location={location}
            startDate={startDate}
            startTime={startTime}
            endTime={endTime || startTime}
            endDate={endDate || startDate}
            options={['Apple','Google', 'Microsoft365','iCal']}
            size="5"
            hideBackground
            hideBranding
            hideCheckmark
            trigger='click'
        ></AddToCalendarButton>
    )
}