'use client';

import { useState, useEffect } from 'react';
import Button from './button';

interface DistanceSelectProps {
    onUpdate?: (zipcode: string, miles: number) => void;
    label?: string;
}

export default function DistanceSelect({ onUpdate, label }: DistanceSelectProps) {
    const [zipcode, setZipcode] = useState(() => {
        const stored = localStorage.getItem('zipcode');
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
        <form onSubmit={handleSubmit} className="flex items-center justify-center gap-2">
            <span className="text-gray-700 font-medium">{label || 'Search'} within</span>
            
            <input
                type="number"
                min="1"
                max="100"
                value={miles}
                onChange={(e) => setMiles(Number(e.target.value))}
                className="w-16 border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <span className="text-gray-700 font-medium">miles of</span>
            
            <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value.replace(/\D/g, ''))}
                placeholder="ZIP Code"
                maxLength={5}
                inputMode="numeric"
                className="w-28 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button caption="Update" disabled={zipcode.trim().length !== 5} />
        </form>
    );
}
