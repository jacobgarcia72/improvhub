export default function Button({ caption, disabled = false, submit = false, onClick, className, style = 'primary' }: {
    caption: string,
    disabled?: boolean,
    submit?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    className?: string,
    style?: 'primary' | 'link'
}) {
    let classes = "transition-colors";
    if (className) classes += ` ${className}`;
    if (style === 'primary') classes += ' mb-0.5 text-center bg-[#296c93] hover:bg-[#2098dd] disabled:bg-gray-300 text-white rounded';
    if (style === 'link') classes += ' inline-block text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline';
    return (
        <button type={submit ? 'submit' : 'button'} disabled={disabled} onClick={onClick} className={classes}>
            {caption}
        </button>
    )
}