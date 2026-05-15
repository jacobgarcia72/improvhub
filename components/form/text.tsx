export default function Text({ label, name, rows = 3 }: {
    label?: string, name: string, rows?: number
}) {
    return (
        <div className="flex flex-col">
            {label && <label htmlFor={name}>{label}</label>}
            <textarea name={name} id={name} rows={rows} maxLength={1000}
                className="border border-gray-300 rounded px-3 py-2"
            />
        </div>
    )
}