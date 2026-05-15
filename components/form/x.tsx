import Image from "next/image";

export default function XButton({ onClick }: { onClick: () => void }) {
    return <button
        type="button"
        onClick={onClick}
        >
            <Image src="/icons/x.svg" alt="Remove" width={16} height={16} />
        </button>
}