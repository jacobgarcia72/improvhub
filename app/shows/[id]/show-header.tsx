import { theatres } from "@/lib/theatres";
import CoverPhoto from "@/components/cover-photo";
import { Event } from "@/types";

export default async function ShowHeader({ children, show, showImage = true }: {
    children?: React.ReactNode,
    show: Event,
    showImage?: boolean
}) {

    const theatre = theatres.find(t => t.name === show.theatre);
    const imageUrl = show.image || theatre?.image;

    return (
        <>
            <div className="w-full flex flex-row items-center">
                <div className="w-full flex flex-row justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl">{show.title}</h1>
                        {show.theatre && <h2 className="mb-3">{show.theatre}</h2>}
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