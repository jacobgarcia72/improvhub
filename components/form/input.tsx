'use client';

import Image from "next/image";

interface InputProps {
    className?: string,
    label?: string,
    name: string,
    type?: string,
    inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search",
    required?: boolean,
    placeholder?: string,
    value?: string,
    onChange?: (value: string) => void,
    onBlur?: (value: string) => void,
    maxLength?: number,
    disabled?: boolean;
    min?: number;
    max?: number;
    autocomplete?: boolean;
    image?: string;
}

export default function Input({
    className,
    label,
    name,
    type = 'text',
    inputMode,
    required = false,
    placeholder,
    value,
    onChange,
    onBlur,
    maxLength = 50,
    disabled = false,
    min,
    max,
    autocomplete = true,
    image,
}: InputProps) {
    let inputLabel = label;
    if (label && required) inputLabel += ' *';

    let inputPlaceholder = placeholder;
    if (!placeholder && type === 'url') inputPlaceholder = 'https://';

    return (
        <div className={`flex flex-col ${className} relative`}>
            {label && <label htmlFor={name}>{inputLabel}</label>}
            {image && (
                <div className='mr-2' style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}>
                    <Image src={image} alt={label || placeholder || name} width={25} height={25} />
                </div>
            )}
            <input
                style={image ? {paddingLeft: '42px'} : undefined}
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                onBlur={onBlur ? (e) => onBlur(e.target.value) : undefined}
                type={type}
                name={name}
                id={name}
                required={required}
                placeholder={inputPlaceholder}
                inputMode={inputMode}
                maxLength={type === 'zipcode' ? 5 : maxLength}
                disabled={disabled}
                min={min}
                max={max}
                autoComplete={autocomplete ? 'on' : 'new-text'}
            />
        </div>
    )
}