import CoverPhoto from "@/components/cover-photo";
import { TheatreLink } from "@/components/theatre-link";
import { getTheatre } from "@/lib/theatres";
import { Event } from "@/types";

export default async function EventHeader({ children, event, eventImage = true }: {
    children?: React.ReactNode,
    event: Event,
    eventImage?: boolean
}) {

    const theatre = event.theatre ? await getTheatre(event.theatre) : null;
    const imageUrl = event.image;
    return (
        <>
            <div className="w-full flex flex-row items-center">
                <div className="w-full flex flex-row justify-between flex-wrap">
                    <div>
                        <h1 className="text-2xl">{event.title}</h1>
                        {event.theatre ? (
                            <TheatreLink theatre={theatre && ({ text: theatre.name, image: theatre.image, id: theatre.id }) || event.theatre} removePadding />
                        ) : null}
                    </div>
                    <div>
                        {children}
                    </div>
                </div>
            </div>
            {eventImage && imageUrl && <CoverPhoto src={imageUrl} alt={event.title} photoCredit={event.photoCredit} />}
        </>
    )
}