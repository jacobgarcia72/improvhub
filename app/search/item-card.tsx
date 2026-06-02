import { Border } from "@/components/border";
import { optimizeImage } from "@/lib/cloudinary";
import { formatTime } from "@/lib/dates";
import { removeLeadingArticles } from "@/lib/helper-functions";
import { theatres } from "@/lib/theatres";
import { Event, Team, Theatre } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ItemCard({ item, type, time }: { item: Event | Team | Theatre, type: string, time?: string }) {
    const image = (
        item.image && optimizeImage(item.image, 300, 300, 90, true)
    ) || (
        'theatre' in item && (
            theatres.find((t) => removeLeadingArticles(t.name) === removeLeadingArticles(item.theatre || ''))
        )?.image
    );
    const name = 'name' in item ? item.name : 'title' in item ? item.title : '';
    const link = 'id' in item ? `/${type}/${item.id}` : `/search?for=shows&theatre=${item.name.toLowerCase().split(" ").join("+")}`
    return (
        <Link href={link}>
            <Border className="flex flex-col h-[300px] w-[222px] m-2 w-44 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                {image ? (
                    <div className="h-[120px] w-full bg-gray-300">
                        <Image src={image} alt={name} width={120} height={120} className="object-cover h-[120px] w-full" />
                    </div>
                ) : (
                    <div className="h-[15px] w-full" />
                )}
                <div className={`w-full h-[${image ? 180 : 285}px] pb-1 px-4 pt-2`}>
                    <h2 className="leading-none text-lg pt-1 pb-1 text-slate-900">{name}</h2>
                    <div className="h-full fade-out text-sm text-gray-700 overflow-hidden text-ellipsis flex flex-col gap-1 pt-1">
                        {time ? (
                            <time className="mt-[-6px] text-sm text-slate-700">{formatTime(time)}</time>
                        ) : null}
                        {'theatre' in item && item.theatre ? (
                            <p>{item.theatre}</p>
                        ) : null}
                        {'description' in item && item.description ? (
                            <p>{item.description.replaceAll('<br>', '\n')}</p>
                        ) : null}
                        {'city' in item && item.city && 'state' in item && item.state ? (
                            <p>{`${item.city}, ${item.state}`}</p>
                        ) : null}
                    </div>
                </div>
            </Border>
        </Link>
    )
}