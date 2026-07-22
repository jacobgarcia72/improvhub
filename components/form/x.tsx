import Image from "next/image";

export default function XButton({ onClick }: { onClick: () => void }) {
    return <button
            type="button"
            onClick={onClick}
            className="icon-button hover:scale-130 transition-all duration-200"
        >
            <Image className="dark:brightness-[800%] hover:brightness-300" src="/icons/x.svg" alt="Remove" width={16} height={16} />
        </button>
}