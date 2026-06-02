import { optimizeImage } from "@/lib/cloudinary";
import { removeLeadingArticles } from "@/lib/helper-functions";
import { theatres } from "@/lib/theatres";
import { Event, Team } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Border } from "./border";

export default function MiniCard({ item, type }: { item: Event | Team, type: string }) {
    const image = (
        item.image && optimizeImage(item.image, 300, null, 80)
    ) || (
        'theatre' in item && (
            theatres.find((t) => removeLeadingArticles(t.name) === removeLeadingArticles(item.theatre || ''))
        )?.image
    );
    const name = 'name' in item ? item.name : 'title' in item ? item.title : '';
    return (
        <Link href={`/${type}s/${item.id}`}>
            <Border className="flex flex-row h-[132px] w-[300px] m-2 w-44 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                {image ? (
                    <div className="w-[132px] h-full bg-gray-300">
                        <div className="flex h-full w-full items-center justify-center">
                            <Image src={image} alt={name} width={120} height={120} className="object-cover h-full w-full" />
                        </div>
                    </div>
                ) : (
                    <div className="w-[48px] h-full" />
                )}
                <div className="w-full h-full pr-2 pb-1 pt-3 pl-1">
                    <h2 className="leading-none text-lg pt-1 pb-1 text-slate-900 overflow-hidden text-ellipsis">{name}</h2>
                    <div className="h-full fade-out text-sm text-gray-700 overflow-hidden text-ellipsis flex flex-col gap-1 pt-1">
                        {item.description ? (
                            <p>{item.description.replaceAll('<br>', '\n')}</p>
                        ) : null}
                        {'theatre' in item && item.theatre ? (
                            <p>{item.theatre}</p>
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