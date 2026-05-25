'use client';

import { useState, useEffect } from 'react';
import Input from './input';
import { validateInputValue } from '@/lib/helper-functions';

interface DistanceSelectProps {
    onUpdate?: (location: string, miles: number) => void;
}

export default function DistanceSelect({ onUpdate }: DistanceSelectProps) {
    const [location, setLocation] = useState<string>('');
    const [miles, setMiles] = useState(10);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

    useEffect(() => {
        if (location) return;
        // Get user's location and reverse geocode to ZIP code
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                        );
                        const data = await response.json();
                        // Extract ZIP code from address
                        const zip = data.address?.postcode || '';
                        if (zip) {
                            setLocation(zip.replace(/\D/g, '').slice(0, 5));
                        }
                    } catch (error) {
                        console.error('Error getting location:', error);
                    }
                }
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUpdate = (type: string, value: string) => {
        const loc = type === 'location' ? value : location;
        const m = type === 'miles' ? value : miles;
        clearTimeout(typingTimeout);
        if (
            onUpdate && loc && (
                validateInputValue(loc, 'zipcode') ||
                validateInputValue(loc, 'city') ||
                validateInputValue(loc, 'state')
            )
        ) {
            setTypingTimeout(
                setTimeout(() => onUpdate(loc, Number(m)), 500)
            )
        }
    };

    return (
        <form className="flex items-end justify-end gap-2 w-[358px]">
            <Input
                name="location"
                value={location}
                onChange={(value) => {
                    setLocation(value);
                    handleUpdate('location', value);
                }}
                label="City and State or ZIP Code"
                className="w-[200px]"
            />
            <Input
                name="miles"
                label='Search Radius (Miles)'
                placeholder='Miles'
                type="number"
                min={1}
                max={100}
                value={`${miles}`}
                onChange={(value) => {
                    setMiles(Number(value));
                    handleUpdate('miles', value);
                }}
                className="w-[150px]"
            />
        </form>
    );
}
