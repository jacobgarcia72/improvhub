import { optimizeImage } from "@/lib/optimize-image";
import { InputOption } from "@/types";
import Image from "next/image";
import Link from "next/link";

export function TheatreLink({ theatre }: {theatre: InputOption}) {
    if (typeof theatre === 'string') {
        return (
            <p className="mb-2 mt-2">{theatre}</p>
        )
    }
    return (
        <Link
            className="link flex flex-row gap-2 items-center w-fit"
            href={`/theatres/${theatre.id}`}
        >
            {theatre.image ? (
                <Image
                    src={optimizeImage(theatre.image, 72, 72, 90, true, true)}
                    alt={theatre.text} width={36} height={36}
                    className="mb-[10px]"
                />
            ) : null}
            <p className="mb-2 mt-2">{theatre.text}</p>
        </Link>
    )
}