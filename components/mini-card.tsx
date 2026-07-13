'use client'
import { optimizeImage } from "@/lib/optimize-image";
import { Event, Troupe, Theatre, User } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Border } from "./border";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { pluralize } from "@/lib/helper-functions";
import { useEffect, useState } from "react";

export default function MiniCard({ item, type, dateTime, includeDescription, className }: {
    item: Event | Troupe | User,
    type: string,
    dateTime?: string,
    includeDescription?: boolean,
    className?: string
}) {
    const image = (
        item.image && optimizeImage(item.image, 300, 300, 80, true)
    );
    let name = 'name' in item ? item.name : 'title' in item ? item.title : '';
    if (!name && 'firstName' in item && 'lastName' in item) name = `${item.firstName} ${item.lastName}`;
    let url = `/${type === 'user' ? 'profile' : `${pluralize(type)}`}/${item.id}/`;
    if (dateTime) url += `${dateTime}/`;

    const [theatreName, setTheatreName] = useState<string>();
    async function getTheatreName(idOrName: string) {
        const res = await fetch(`/api/theatre?idOrName=${encodeURIComponent(idOrName)}`);
        const data: Theatre | null = await res.json();
        if (data) {
            setTheatreName(data.name);
        }
    }
    useEffect(() => {
        if ('theatre' in item && item.theatre) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            getTheatreName(item.theatre);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <Link href={url}>
            <Border className={`${className} flex flex-row h-[132px] w-[226px] m-2 w-44 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}>
                {image ? (
                    <div className="w-[132px] h-full bg-gray-300">
                        <div className="flex h-full w-full items-center justify-center">
                            <Image src={image} alt={name} width={120} height={120} className="object-cover h-full w-full" />
                        </div>
                    </div>
                ) : (
                    <div className="w-[48px] h-full" />
                )}
                <div className="w-full h-full pr-2 pb-1 pt-3 pl-2">
                    <h2 className={`leading-none text-[1.005em] pb-1 text-slate-900 dark:text-slate-100 overflow-hidden text-ellipsis`}>{name}</h2>
                    <div className="h-full fade-out text-sm text-gray-700 dark:text-gray-400 overflow-hidden text-ellipsis flex flex-col gap-1 pt-0.5">
                        {dateTime ? <p className="leading-none text-[0.85em] text-gray-900 dark:text-gray-200 font-semibold mt-[-1px]">{formatDateTimeForDisplay(dateTime)}</p> : null}
                        {includeDescription && 'description' in item && item.description ? (
                            <p>{item.description.replaceAll('<br>', '\n')}</p>
                        ) : null}
                        {theatreName ? (
                            <p className="leading-none">{theatreName}</p>
                        ) : null}
                        {'city' in item && item.city && 'state' in item && item.state ? (
                            <p className="leading-none">{`${item.city}, ${item.state}`}</p>
                        ) : null}
                    </div>
                </div>
            </Border>
        </Link>
    )
}