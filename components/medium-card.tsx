import { optimizeImage } from "@/lib/optimize-image";
import { Event, Troupe, User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Border } from "./border";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { getTheatre } from "@/lib/theatres";
import { pluralize } from "@/lib/helper-functions";

export default async function MediumCard({ item, type, dateTime }: {
    item: Event | Troupe | User,
    type: string,
    dateTime?: string
}) {
    const theatre = 'theatre' in item && item.theatre && (await getTheatre(item.theatre)) || null;
    const image = (
        item.image && optimizeImage(item.image, 600, 600, 80, true)
    ) || (
            theatre?.image
    );
    let name = 'name' in item ? item.name : 'title' in item ? item.title : '';
    if (!name && 'firstName' in item && 'lastName' in item) name = `${item.firstName} ${item.lastName}`;
    let url = `/${type === 'user' ? 'profile' : `${pluralize(type)}`}/${item.id}/`;
    if (dateTime) url += `${dateTime}/`;
    return (
        <Link href={url}>
            <Border className="flex flex-row h-[160px] w-[346px] m-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                {image ? (
                    <div className="w-[200px] h-full bg-gray-300">
                        <div className="flex h-full w-full items-center justify-center">
                            <Image src={image} alt={name || type} width={120} height={120} className="object-cover h-full w-full" />
                        </div>
                    </div>
                ) : (
                    <div className="w-[48px] h-full" />
                )}
                <div className="w-full h-full pr-2 pb-1 pt-4 pl-2">
                    <h2 className={`${dateTime ? 'mt-[-2px]' : ''} leading-none text-[1.07em] pb-0.5 text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis`}>{name}</h2>
                    <div className="h-full fade-out text-sm text-gray-700 dark:text-gray-400 overflow-hidden text-ellipsis flex flex-col gap-1 pt-0.5">
                        {dateTime ? <p className="text-[0.9em] text-gray-900 dark:text-gray-200 font-semibold mt-[-2px] mb-[-3px]">{formatDateTimeForDisplay(dateTime)}</p> : null}
                        {'description' in item && item.description ? (
                            <p>{item.description.replaceAll('<br>', '\n')}</p>
                        ) : null}
                        {theatre ? (
                            <p>{theatre.name}</p>
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