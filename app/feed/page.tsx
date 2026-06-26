import { getNewsFeedItems } from "@/lib/news"
import { optimizeImage } from "@/lib/optimize-image";
import { getShow } from "@/lib/shows";
import { getTeam } from "@/lib/teams";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId, getUserAbbreviated } from "@/lib/users";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function FeedPage() {
    const userId = await getCurrentUserId();
    if (!userId) notFound();
    const newsFeedItems = await getNewsFeedItems(userId);
    const getImage = (url? :string | null) => {
        if (!url) return null;
        return (
            <Image
                className="rounded-lg"
                src={optimizeImage(url, 72, 72, 90, true)}
                alt={'Image'} width={72} height={72}
            />
        )
    }
    return (
        <section>
            {await Promise.all(newsFeedItems.map(async (item, i) => {
                let content: React.ReactNode;
                let image: string | null | undefined = null;
                switch (item.newsType) {
                    case 'new_show':
                        const theatre = await getTheatre(item.followId);
                        const newShow = await getShow(item.newsItemId);
                        if (!theatre || !newShow) return null;
                        content = <p><Link className="link" href={`/theatres/${theatre.id}`}>{theatre.name}</Link> has a new show &ndash; <Link className="link" href={`/shows/${newShow.id}`}>{newShow.title}</Link>!</p>
                        image = newShow.image || theatre.image;
                        break;
                    case 'cast_in_show':
                        const cast = item.followType === 'team' ? (
                            await getTeam(item.followId)
                        ) : await getUserAbbreviated(item.followId);
                        const showCast = await getShow(item.newsItemId);
                        if (!cast || !showCast) return null;
                        content = <p><Link className="link" href={`/${item.followType === 'team' ? 'teams' : 'profile'}/${cast.id}`}>{cast.name}</Link> has been cast in <Link className="link" href={`/shows/${showCast.id}`}>{showCast.title}</Link>!</p>
                        image = cast.image || showCast.image;
                        break;
                    case 'going_to_show':
                        const showGoer = await getUserAbbreviated(item.followId);
                        const showGoingTo = await getShow(item.newsItemId);
                        if (!showGoer || !showGoingTo) return null;
                        content = <p><Link className="link" href={`/profile/${showGoer.id}`}>{showGoer.name}</Link> is going to <Link className="link" href={`/shows/${showGoingTo.id}`}>{showGoingTo.title}</Link>.</p>
                        image = showGoer.image || showGoingTo.image;
                        break;
                    case 'new_team':
                        const teamCreator = await getUserAbbreviated(item.followId);
                        const newTeam = await getTeam(item.newsItemId);
                        if (!teamCreator || !newTeam) return null;
                        content = <p><Link className="link" href={`/profile/${teamCreator.id}`}>{teamCreator.name}</Link> has created a new team page for <Link className="link" href={`/teams/${newTeam.id}`}>{newTeam.name}</Link>.</p>
                        image = newTeam.image || teamCreator.image;
                        break;
                    case 'joined_team':
                        const teamMember = await getUserAbbreviated(item.followId);
                        const teamJoined = await getTeam(item.newsItemId);
                        if (!teamMember || !teamJoined) return null;
                        content = <p><Link className="link" href={`/profile/${teamMember.id}`}>{teamMember.name}</Link> has joined a team! <Link className="link" href={`/teams/${teamJoined.id}`}>{teamJoined.name}</Link></p>
                        image = teamMember.image || teamJoined.image;
                        break;
                    default:
                        return;
                }
                return (
                    <div key={i} className="flex flex-row gap-2 items-center">
                        {getImage(image)}
                        <div className="pb-2">
                            {content}
                        </div>
                    </div>
                )
            }))}
        </section>
    )
}