import { Border } from "@/components/border";
import FollowButton from "@/components/follow-button";
import { optimizeImage } from "@/lib/optimize-image";
import { formatTime } from "@/lib/dates";
import { getFollowing } from "@/lib/users";
import { Event, Troupe, Theatre } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { getTheatre } from "@/lib/theatres";

export default async function ItemCard({
    item, type, time, date, userId
} : {
    item: Event | Troupe | Theatre | Partial<Theatre>, type: string, time?: string, date?: string, userId?: string | null
}) {
    const theatre = ('theatre' in item && item.theatre) ? await getTheatre(item.theatre) : null;
    const image = (
        item.image && optimizeImage(item.image, 600, 600, 100, true)
    ) || theatre?.image;
    const name = 'name' in item ? item.name : 'title' in item ? item.title : '';
    let link = `/${type}/${item.id}`;
    if (date && time) link += `/${date}%20${time}`;

    let following = false;
    let showFollowButton = false;
    if (userId && 'id' in item) {
        if (type === 'troupes') {
            following = item.id && await getFollowing(userId, item.id, 'troupe') || false;
            showFollowButton = true;
        } else if (type === 'theatres') {
            following = item.id && await getFollowing(userId, item.id, 'theatre') || false;
            showFollowButton = true;
        }
    }
    return (
        <Border className="w-[180px] h-[240px] relative flex flex-col m-2 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            {showFollowButton ? <div className="absolute right-2 top-2">
                <FollowButton mini userId={userId || ''} followId={'id' in item && item.id ? item.id : ''} type={type === 'troupes' ? 'troupe' : 'theatre'} following={following} />
            </div> : null}
            <Link href={link} className="h-full">
                {image ? (
                    <div className={`${type === 'theatres' ? 'h-[150px]' : 'h-[90px]'} w-full bg-gray-300`}>
                        <Image src={image} alt={name || type} width={120} height={type === 'theatres' ? 150 : 90} className={`object-cover h-[${type === 'theatres' ? 150 : 90}px] w-full`} />
                    </div>
                ) : (
                    <div className="h-[15px] w-full" />
                )}
                <div className={`w-full ${image ? 'h-[150px]' : 'h-[225px]'} pb-1 px-4 pt-2`}>
                    <h2 className="leading-none text-lg pt-1 pb-1 text-gray-900 dark:text-gray-100">{name}</h2>
                    <div className="h-full fade-out text-sm text-gray-800  dark:text-gray-200 overflow-hidden text-ellipsis flex flex-col gap-1 pt-1">
                        {time ? (
                            <time className="mt-[-6px] text-sm text-gray-700  dark:text-gray-300 dark:text-gray-400">{formatTime(time)}</time>
                        ) : null}
                        {theatre ? (
                            <p className="font-semibold text-gray-700  dark:text-gray-300 dark:text-gray-400">{theatre.name}</p>
                        ) : null}
                        {'description' in item && item.description ? (
                            <p>{item.description.replaceAll('<br>', '\n')}</p>
                        ) : null}
                        {'address' in item && item.address ? (
                            <p>{item.address}</p>
                        ) : null}
                        {'city' in item && item.city && 'state' in item && item.state ? (
                            <p>{`${item.city}, ${item.state}`}</p>
                        ) : null}
                    </div>
                </div>
            </Link>
        </Border>
    )
}