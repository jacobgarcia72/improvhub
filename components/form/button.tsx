export default function Button({ caption, disabled = false, type = 'submit', onClick }: {
    caption: string,
    disabled?: boolean,
    type?: 'button' | 'submit' | 'reset',
    onClick?: () => void,
}) {
    return (
        <button type={type} disabled={disabled} onClick={onClick}
            className="text-center bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-1 px-4 rounded transition-colors"
        >
            {caption}
        </button>
    )
}