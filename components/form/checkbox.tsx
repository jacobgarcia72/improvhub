'use client';

export default function Checkbox({ onChange, name, label, value, defaultChecked }: {
    onChange?: (checked: boolean) => void,
    name: string,
    label: string,
    value?: string
    defaultChecked?: boolean
}) {
    return (
    <div className="checkbox-wrapper">
        <input
            name={name}
            type='checkbox'
            id={name}
            className='mr-1'
            value={value || 1}
            onChange={(e) => onChange && onChange(e.target.checked)}
            defaultChecked={defaultChecked}
        />
        <label htmlFor={name}>{label}</label>
    </div>
)
}