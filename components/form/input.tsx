export default function Input({ label, name, type = 'text', required = false }: {
    label?: string, name: string, type?: string, required?: boolean
}) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label htmlFor={name}>{label}</label>}
            <input type={type} name={name} id={name} required={required}
                className="border border-gray-300 rounded px-3 py-2"
            />
        </div>
    )
}