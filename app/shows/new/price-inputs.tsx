'use client';

import Input from "@/components/form/input";
import { useState } from "react";

export default function PriceInputs() {
    const [ticketPrice, setTicketPrice] = useState<string>();

    return (
        <div className="flex flex-row gap-4">
            <div>
                <Input label="Ticket Price" name="price" type="number" isCurrency
                onChange={(value) => setTicketPrice(value || value === '0' ? value : undefined)}
            />
            </div>
            <div>
                <Input label="Price at Door" name="door" type="number" isCurrency placeholder={ticketPrice} />
            </div>
        </div>
    )
}