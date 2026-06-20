import CoverPhoto from "@/components/cover-photo";
import { getTheatre } from "@/lib/theatres";
import { Event } from "@/types";
import Link from "next/link";

export default async function ShowHeader({ children, show, showImage = true }: {
    children?: React.ReactNode,
    show: Event,
    showImage?: boolean
}) {

    const theatre = show.theatre ? await getTheatre(show.theatre) : null;
    const imageUrl = show.image || theatre?.image;
    return (
        <>
            <div className="w-full flex flex-row items-center">
                <div className="w-full flex flex-row justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl">{show.title}</h1>
                        {show.theatre ? (
                            theatre?.id ? (
                                <Link href={`/theatres/${theatre.id}`}>
                                    <h2 className="mb-3 link">{show.theatre}</h2>
                                </Link>
                            ) : (
                                <h2 className="mb-3">{show.theatre}</h2>
                            )
                        ) : null}
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
            {showImage && imageUrl && <CoverPhoto src={imageUrl} alt={show.title} photoCredit={show.photoCredit} />}
        </>
    )
}