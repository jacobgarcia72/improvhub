'use client'

import Input from "@/components/form/input"
import { validateInputValue } from "@/lib/helper-functions";
import { useState } from "react";

export default function PriceInputs() {
    const [price, setPrice] = useState('');
    const [doorPrice, setDoorPrice] = useState('');
    return (
        <div className="flex flex-row flex-wrap">
            <div className="w-1/2 pr-2">
                <Input
                    value={price}
                    onChange={(value) => validateInputValue(value, 'price') && setPrice(value)}
                    label="Ticket Price ($)"
                    name="price"
                    inputMode='decimal'
                    autocomplete={false}
                />
            </div>
            <div className="w-1/2">
                <Input
                    value={doorPrice}
                    onChange={(value) => validateInputValue(value, 'price') && setDoorPrice(value)}
                    label="Price at Door (if different)"
                    name="doorPrice"
                    inputMode='decimal'
                    autocomplete={false}
                    disabled={price === ''}
                />
            </div>
        </div>
    )
}