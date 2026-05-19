export default function Button({ caption, disabled = false, type = 'submit', onClick }: {
    caption: string,
    disabled?: boolean,
    type?: 'button' | 'submit' | 'reset',
    onClick?: () => void,
}) {
    return (
        <button type={type} disabled={disabled} onClick={onClick}
            className="mb-0.5 text-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
        >
            {caption}
        </button>
    )
}