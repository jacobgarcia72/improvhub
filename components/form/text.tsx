import { forwardRef } from "react";

type TextProps = {
    label?: string;
    name: string;
    rows?: number;
    value?: string | null;
};

function Text({ label, name, rows = 3, value }: TextProps, ref: React.ForwardedRef<HTMLTextAreaElement>) {
    return (
        <div className="flex flex-col">
            {label && <label htmlFor={name}>{label}</label>}
            <textarea ref={ref} name={name} id={name} rows={rows} maxLength={1000}
                className="border border-gray-300 rounded px-3 py-2"
                defaultValue={value || ''}
            />
        </div>
    )
}

export default forwardRef(Text);
