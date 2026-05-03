interface InputProps {
    label?: string,
    name: string,
    type?: string,
    required?: boolean,
    placeholder?: string,
    onChange?: (value: string) => void,
    isCurrency?: boolean,
}
const divClass = "flex flex-col gap-1";
const inputClass = "border border-gray-300 rounded px-3 py-2";

function enforceDecimalPlaces(name: string): string {
    const input = document.getElementById(name) as HTMLInputElement | null;
    if (input) {
        let value: string | number = parseFloat(input.value);
        if (!isNaN(value)) {
            value = value.toFixed(2).toString();
            input.value = value;
            return value;
        }
    }
    return '';
}

function ClientSideInput({ label, name, type = 'text', required = false, placeholder, onChange, isCurrency }: InputProps) {
    'use client';

    return (
        <div className={divClass}>
            {label && <label htmlFor={name}>{label}</label>}
            <input className={inputClass}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                onBlur={isCurrency ? () => {
                    const newValue = enforceDecimalPlaces(name);
                    if (onChange) onChange(newValue);
                } : undefined}
                type={type}
                name={name}
                id={name}
                required={required}
                placeholder={placeholder}
                step={isCurrency ? 0.01 : undefined}
            />
        </div>
    )
}

export default function Input({ label, name, type = 'text', required = false, placeholder, onChange, isCurrency }: InputProps) {
    let inputLabel = label;
    if (label && required) inputLabel += ' *';

    if (onChange) {
        return <ClientSideInput label={inputLabel} name={name} type={type} required={required} placeholder={placeholder} onChange={onChange} isCurrency={isCurrency} />
    }

    return (
        <div className={divClass}>
            {label && <label htmlFor={name}>{inputLabel}</label>}
            <input className={inputClass}
                onBlur={isCurrency ? () => enforceDecimalPlaces(name) : undefined}
                type={type}
                name={name}
                id={name}
                required={required}
                placeholder={placeholder}
                step={isCurrency ? 0.01 : undefined}
            />
        </div>
    )
}