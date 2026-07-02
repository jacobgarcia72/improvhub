import { formatDateForDisplay, formatDateTimeForDisplay } from "@/lib/dates";
import { capitalize, pluralize } from "@/lib/helper-functions";
import { getNewsFeedItems } from "@/lib/news"
import { optimizeImage } from "@/lib/optimize-image";
import { getEvent, getShow } from "@/lib/shows";
import { getTeam } from "@/lib/teams";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId, getUserAbbreviated } from "@/lib/users";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { appName } from "@/lib/app-info";
import { protectRoute } from "@/lib/auth";
import { EventType } from "@/types";

export const metadata: Metadata = {
    title: `News Feed | ${appName}`
};

export default async function FeedPage() {
    await protectRoute();
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
            <h1 className="text-xl mb-4">News Feed</h1>
            {await Promise.all(newsFeedItems.map(async (item, i) => {
                let content: React.ReactNode;
                let image: string | null | undefined = null;
                const { date, newsType, followId, followType, newsItemId, newsItemDate, otherData } = item;
                switch (newsType) {
                    case 'new_theatre':
                        const newTheatre = await getTheatre(newsItemId);
                        const theatreCreator = otherData ? await getUserAbbreviated(otherData) : null;
                        const city = capitalize(followId.split(' ').slice(0, -1).join(' '));
                        if (!newTheatre || !theatreCreator || !city) return null;
                        content = <p><Link className="link" href={`/theatres/${newTheatre.id}`}>{newTheatre.name}</Link> has just landed in {city}! Theatre page created by <Link className="link" href={`/profile/${theatreCreator.id}`}>{theatreCreator.name}</Link>.</p>
                        image = newTheatre.image;
                        break;
                    case 'new_show':
                    case 'new_jam':
                    case 'new_class':
                    case 'new_workshop':
                        const theatre = await getTheatre(followId);
                        const newEventType = newsType.split('_')[1] as EventType;
                        const newEvent = await getEvent(newsItemId, newEventType);
                        const newEventCreator = otherData ? await getUserAbbreviated(otherData) : null;
                        if (!theatre || !newEvent || !newEventCreator) return null;
                        content = <p><Link className="link" href={`/profile/${newEventCreator.id}`}>{newEventCreator.name}</Link> posted a new {newEventType}, <Link className="link" href={`/${pluralize(newEventType)}/${newEvent.id}`}>{newEvent.title}</Link>, at <Link className="link" href={`/theatres/${theatre.id}`}>{theatre.name}</Link>.</p>
                        image = newEvent.image || theatre.image;
                        break;
                    case 'cast_in_show':
                        const cast = followType === 'team' ? (
                            await getTeam(followId)
                        ) : await getUserAbbreviated(followId);
                        const showCast = await getShow(newsItemId);
                        if (!cast || !showCast || !newsItemDate) return null;
                        let verb = 'is performing in';
                        if (otherData === 'team') verb = 'are performing in';
                        if (otherData === 'tech') verb = 'is teching';
                        if (otherData === 'director') verb = 'is directing';
                        if (otherData === 'musician') verb = 'is providing musical accompaniment in';
                        content = <p><Link className="link" href={`/${followType === 'team' ? 'teams' : 'profile'}/${cast.id}`}>{cast.name}</Link> {verb} <Link className="link" href={`/shows/${showCast.id}`}>{showCast.title}</Link> on {formatDateForDisplay(newsItemDate.split(' ')[0])}.</p>
                        image = cast.image || showCast.image;
                        break;
                    case 'going_to_show':
                    case 'going_to_jam':
                    case 'going_to_class':
                    case 'going_to_workshop':
                        const eventGoer = await getUserAbbreviated(followId);
                        const eventGoingType = newsType.split('_')[1] as EventType;
                        const eventGoingTo = await getEvent(newsItemId, eventGoingType);
                        if (!eventGoer || !eventGoingTo || !newsItemDate) return null;
                        content = <p><Link className="link" href={`/profile/${eventGoer.id}`}>{eventGoer.name}</Link> is going to <Link className="link" href={`/${pluralize(eventGoingType)}/${eventGoingTo.id}/${newsItemDate}`}>{eventGoingTo.title}</Link> on {formatDateForDisplay(newsItemDate.split(' ')[0])}.</p>
                        image = eventGoer.image || eventGoingTo.image;
                        break;
                    case 'new_team':
                        const teamCreator = await getUserAbbreviated(followId);
                        const newTeam = await getTeam(newsItemId);
                        if (!teamCreator || !newTeam) return null;
                        content = <p><Link className="link" href={`/profile/${teamCreator.id}`}>{teamCreator.name}</Link> has created a new team page for <Link className="link" href={`/teams/${newTeam.id}`}>{newTeam.name}</Link>.</p>
                        image = newTeam.image || teamCreator.image;
                        break;
                    case 'joined_team':
                        const teamMember = await getUserAbbreviated(followId);
                        const teamJoined = await getTeam(newsItemId);
                        if (!teamMember || !teamJoined) return null;
                        content = <p><Link className="link" href={`/profile/${teamMember.id}`}>{teamMember.name}</Link> is now a team member of <Link className="link" href={`/teams/${teamJoined.id}`}>{teamJoined.name}</Link>!</p>
                        image = teamMember.image || teamJoined.image;
                        break;
                    default:
                        return;
                }
                return (
                    <div key={i} className="flex flex-row gap-2 items-center mb-4">
                        {getImage(image)}
                        <div className="pb-1">
                            {content}
                            <p className="ml-1 text-xs text-mist-500">{formatDateTimeForDisplay(date)}</p>
                        </div>
                    </div>
                )
            }))}
        </section>
    )
}