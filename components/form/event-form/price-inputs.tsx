'use client'

import Input from "@/components/form/input"
import { validateInputValue } from "@/lib/helper-functions";
import { Event } from "@/types";
import { useState } from "react";

export default function PriceInputs({ existingShow, type }: {
    existingShow?: Event,
    type: 'show' | 'workshop' | 'class'
}) {
    const [price, setPrice] = useState(existingShow?.price?.toString() ?? '');
    const [doorPrice, setDoorPrice] = useState(existingShow?.doorPrice?.toString() ?? '');
    return (
        <div className="flex flex-row flex-wrap">
            <div className="w-2/5 pr-2">
                <Input
                    value={price}
                    onChange={(value) => validateInputValue(value, 'price') && setPrice(value)}
                    label={`${type === 'show' ? 'Ticket Price' : 'Registration Cost'} ($)`}
                    name="price"
                    inputMode='decimal'
                    autocomplete={false}
                />
            </div>
            {type === 'show' && (
                <div className="w-2/5">
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
            )}
        </div>
    )
}