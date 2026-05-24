export default function Button({ caption, disabled = false, type = 'submit', onClick, className, style = 'primary' }: {
    caption: string,
    disabled?: boolean,
    type?: 'button' | 'submit' | 'reset',
    onClick?: () => void,
    className?: string,
    style?: 'primary' | 'link'
}) {
    let classes = "transition-colors";
    if (className) classes += ` ${className}`;
    if (style === 'primary') classes += ' mb-0.5 text-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded';
    if (style === 'link') classes += ' inline-block text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline';
    return (
        <button type={type} disabled={disabled} onClick={onClick} className={classes}>
            {caption}
        </button>
    )
}