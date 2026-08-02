'use client';

export default function Checkbox({ onChange, name, id, label, value, defaultChecked, disabled }: {
    onChange?: (checked: boolean) => void,
    name: string,
    id?: string,
    label: string,
    value?: string,
    defaultChecked?: boolean,
    disabled?: boolean
}) {
    const inputId = id || name;

    return (
    <div className="checkbox-wrapper">
        <input
            name={name}
            type='checkbox'
            id={inputId}
            className='mr-1'
            value={value || 1}
            onChange={(e) => onChange && onChange(e.target.checked)}
            defaultChecked={defaultChecked}
            disabled={disabled}
        />
        <label htmlFor={inputId}>{label}</label>
    </div>
)
}
