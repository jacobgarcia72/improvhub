'use client';

import { useState } from "react";

interface InputProps {
    label?: string,
    name: string,
    type?: string,
    required?: boolean,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    maxLength?: number,
    disabled?: boolean;
    min?: number;
    max?: number;
}

export default function Input({
    label,
    name,
    type = 'text',
    required = false,
    placeholder,
    value = '',
    onChange,
    maxLength = 50,
    disabled = false,
    min,
    max,
}: InputProps) {
    const [inputValue, setInputValue] = useState(value);

    const customTypes = ['price', 'zipcode', 'username'];

    let inputLabel = label;
    if (label && required) inputLabel += ' *';

    let inputPlaceholder = placeholder;
    if (!placeholder && type === 'url') inputPlaceholder = 'https://';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (value) {
            if (onChange) onChange(newValue);
            return;
        }
        if (type === 'price') {
            // Allow only numbers and a single decimal point
            if (/^\d*\.?\d?\d?$/.test(newValue)) {
                setInputValue(newValue);
                if (onChange) onChange(newValue);
            }
        } else if (type === 'zipcode') {
            // Allow only numbers, max 5 characters
            if (/^\d{0,5}$/.test(newValue)) {
                setInputValue(newValue);
                if (onChange) onChange(newValue);
            } 
        } else if (type === 'username') {
            // Allow no special characters, max 20 characters
            if (/^[a-zA-Z0-9]{0,20}$/.test(newValue)) {
                setInputValue(newValue);
                if (onChange) onChange(newValue);
            } 
        } else {
            setInputValue(newValue);
            if (onChange) onChange(newValue);
        }
    }

    const getInputMode = (type: string): React.HTMLAttributes<HTMLInputElement>['inputMode'] => {
        if (type === 'price') {
            return 'decimal';
        } else if (type === 'zipcode') {
            return 'numeric';
        } else if (type === 'url') {
            return 'url';
        }
        return;
    }

    return (
        <div className="flex flex-col gap-1">
            {label && <label htmlFor={name}>{inputLabel}</label>}
            <input className="border border-gray-300 rounded px-3 py-2"
                value={value || inputValue}
                onChange={handleChange}
                type={customTypes.includes(type) ? 'text' : type}
                name={name}
                id={name}
                required={required}
                placeholder={inputPlaceholder}
                inputMode={getInputMode(type)}
                maxLength={type === 'zipcode' ? 5 : maxLength}
                disabled={disabled}
                min={min}
                max={max}
            />
        </div>
    )
}