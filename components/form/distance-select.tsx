'use client';

import { useState, useEffect } from 'react';
import Button from './button';
import Input from './input';

interface DistanceSelectProps {
    onUpdate?: (zipcode: string, miles: number) => void;
}

export default function DistanceSelect({ onUpdate }: DistanceSelectProps) {
    const [zipcode, setZipcode] = useState(() => {
        const stored = window?.localStorage.getItem('zipcode');
        return stored || '';
    });
    const [miles, setMiles] = useState(25);

    useEffect(() => {
        if (zipcode) return;
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
                            setZipcode(zip.replace(/\D/g, '').slice(0, 5));
                        }
                    } catch (error) {
                        console.error('Error getting ZIP code:', error);
                    }
                }
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const zip = zipcode.trim();
        if (zip && onUpdate) {
            localStorage.setItem('zipcode', zip);
            onUpdate(zip, miles);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-end justify-end gap-2">
            <Input
                name="zipcode"
                type="text"
                value={zipcode}
                label="ZIP Code"
                className="w-24"
            />
            <Input
                name="miles"
                label='Miles'
                type="number"
                min={1}
                max={100}
                value={`${miles}`}
                onChange={(value) => setMiles(Number(value))}
                className="w-20"
            />
            <Button caption="Update" disabled={zipcode.trim().length !== 5} />
        </form>
    );
}
