import CoverPhoto from "@/components/cover-photo";
import { TheatreLink } from "@/components/theatre-link";
import { getTheatre } from "@/lib/theatres";
import { Event } from "@/types";

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
                            <TheatreLink theatre={theatre && ({ text: theatre.name, image: theatre.image, id: theatre.id }) || show.theatre} removePadding />
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