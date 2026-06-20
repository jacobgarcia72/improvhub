import { Border } from "@/components/border";
import FollowButton from "@/components/follow-button";
import { optimizeImage } from "@/lib/optimize-image";
import { formatTime } from "@/lib/dates";
import { removeLeadingArticles } from "@/lib/helper-functions";
import { theatres } from "@/lib/theatres";
import { getFollowing } from "@/lib/users";
import { Event, Team, Theatre } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function ItemCard({
    item, type, time, date, userId
} : {
    item: Event | Team | Theatre | Partial<Theatre>, type: string, time?: string, date?: string, userId?: string | null
}) {
    const image = (
        item.image && optimizeImage(item.image, 300, 300, 90, true)
    ) || (
        'theatre' in item && (
            theatres.find((t) => t.name && removeLeadingArticles(t.name) === removeLeadingArticles(item.theatre || ''))
        )?.image
    );
    const name = 'name' in item ? item.name : 'title' in item ? item.title : '';
    let link = 'id' in item ? `/${type}/${item.id}` : `/search?for=shows&theatre=${(item.name || '').toLowerCase().split(" ").join("+")}`;
    if (date && time) link += `/${date}%20${time}`;

    let following = false;
    let showFollowButton = false;
    if (userId && (type === 'teams') && ('id' in item)) {
        following = item.id && await getFollowing(userId, item.id, 'team') || false;
        showFollowButton = true;
    }
    return (
        <Border className="relative flex flex-col h-[300px] w-[222px] m-2 w-44 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            {showFollowButton ? <div className="absolute right-2 top-2">
                <FollowButton mini userId={userId || ''} followId={'id' in item && item.id ? item.id : ''} type="team" following={following} />
            </div> : null}
            <Link href={link} className="h-full">
                {image ? (
                    <div className="h-[120px] w-full bg-gray-300">
                        <Image src={image} alt={name || type} width={120} height={120} className="object-cover h-[120px] w-full" />
                    </div>
                ) : (
                    <div className="h-[35px] w-full" />
                )}
                <div className={`w-full ${image ? 'h-[180px]' : 'h-[265px]'} pb-1 px-4 pt-2`}>
                    <h2 className="leading-none text-lg pt-1 pb-1 text-slate-900">{name}</h2>
                    <div className="h-full fade-out text-sm text-gray-800 overflow-hidden text-ellipsis flex flex-col gap-1 pt-1">
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
            </Link>
        </Border>
    )
}