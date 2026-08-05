'use client';

export default function Checkbox({ onChange, name, id, label, value, defaultChecked, disabled, readOnly }: {
    onChange?: (checked: boolean) => void,
    name: string,
    id?: string,
    label: string,
    value?: string,
    defaultChecked?: boolean,
    disabled?: boolean,
    readOnly?: boolean,
}) {
    const inputId = id || name;

    return (
    <div className="checkbox-wrapper">
        <input
            name={name}
            type='checkbox'
            id={inputId}
            className={`mr-1${readOnly ? ' hidden' : ''}`}
            value={value || 1}
            onChange={(e) => onChange && onChange(e.target.checked)}
            defaultChecked={defaultChecked}
            disabled={disabled}
            readOnly={readOnly}
        />
        {readOnly ? (
            <input
                name={`readonly-${name}`}
                type='checkbox'
                id={`readonly-${inputId}`}
                className='mr-1'
                value={value || 1}
                defaultChecked={defaultChecked}
                disabled
                readOnly={readOnly}
            />
        ) : null}
        <label htmlFor={readOnly ? `readonly-${inputId}` : inputId}>{label}</label>
    </div>
)
}
