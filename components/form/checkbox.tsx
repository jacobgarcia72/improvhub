'use client';

export default function Checkbox({ onChange, name, label }: {
    onChange?: (checked: boolean) => void,
    name: string,
    label: string
}) {
    return (
    <div className="checkbox-wrapper">
        <input
            name={name}
            type='checkbox'
            id={name}
            className='mr-1'
            value={1}
            onChange={(e) => onChange && onChange(e.target.checked)}
        />
        <label htmlFor={name}>{label}</label>
    </div>
)
}