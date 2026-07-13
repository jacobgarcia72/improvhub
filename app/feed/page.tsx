import { formatDateForDisplay, formatDateTimeForDisplay } from "@/lib/dates";
import { capitalize, pluralize } from "@/lib/helper-functions";
import { getNewsFeedItems } from "@/lib/news"
import { optimizeImage } from "@/lib/optimize-image";
import { getEvent, getShow } from "@/lib/shows";
import { getTroupe } from "@/lib/troupes";
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
                        const cast = followType === 'troupe' ? (
                            await getTroupe(followId)
                        ) : await getUserAbbreviated(followId);
                        const showCast = await getShow(newsItemId);
                        if (!cast || !showCast || !newsItemDate) return null;
                        let verb = 'is performing in';
                        if (otherData === 'troupe') verb = 'are performing in';
                        if (otherData === 'tech') verb = 'is teching';
                        if (otherData === 'director') verb = 'is directing';
                        if (otherData === 'musician') verb = 'is providing musical accompaniment in';
                        content = <p><Link className="link" href={`/${followType === 'troupe' ? 'troupes' : 'profile'}/${cast.id}`}>{cast.name}</Link> {verb} <Link className="link" href={`/shows/${showCast.id}/${newsItemDate}`}>{showCast.title}</Link> on {formatDateForDisplay(newsItemDate.split(' ')[0])}.</p>
                        image = cast.image || showCast.image;
                        break;
                    case 'going_to_show':
                    case 'going_to_jam':
                    case 'going_to_class':
                    case 'going_to_workshop':
                        const eventGoer = await getUserAbbreviated(followId);
                        const eventGoingType = newsType.split('_')[2] as EventType;
                        const eventGoingTo = await getEvent(newsItemId, eventGoingType);
                        if (!eventGoer || !eventGoingTo || !newsItemDate) return null;
                        content = <p><Link className="link" href={`/profile/${eventGoer.id}`}>{eventGoer.name}</Link> is going to <Link className="link" href={`/${pluralize(eventGoingType)}/${eventGoingTo.id}/${newsItemDate}`}>{eventGoingTo.title}</Link> on {formatDateForDisplay(newsItemDate.split(' ')[0])}.</p>
                        image = eventGoer.image || eventGoingTo.image;
                        break;
                    case 'instructor_for_jam':
                    case 'instructor_for_workshop':
                    case 'instructor_for_class':
                        const instructor = await getUserAbbreviated(followId);
                        const instructorType = newsType.split('_')[2] as EventType;
                        const instructorEvent = await getEvent(newsItemId, instructorType);
                        const instructorTheatre = instructorEvent?.theatre ? await getTheatre(instructorEvent.theatre) : null;
                        if (!instructor || !instructorEvent) return null;
                        content = <p><Link className="link" href={`/profile/${instructor.id}`}>{instructor.name}</Link> is {instructorType === 'jam' ? 'leading' : 'teaching'} a {instructorType}, <Link className="link" href={`/${pluralize(instructorType)}/${instructorEvent.id}`}>{instructorEvent.title}</Link>{instructorTheatre ? <>, at <Link className="link" href={`/theatres/${instructorTheatre.id}`}>{instructorTheatre.name}</Link></> : ''}.</p>
                        image = instructor.image || instructorEvent.image;
                        break;
                    case 'new_troupe':
                        const troupeCreator = await getUserAbbreviated(followId);
                        const newTroupe = await getTroupe(newsItemId);
                        if (!troupeCreator || !newTroupe) return null;
                        content = <p><Link className="link" href={`/profile/${troupeCreator.id}`}>{troupeCreator.name}</Link> has created a new troupe page for <Link className="link" href={`/troupes/${newTroupe.id}`}>{newTroupe.name}</Link>.</p>
                        image = newTroupe.image || troupeCreator.image;
                        break;
                    case 'joined_troupe':
                        const troupeMember = await getUserAbbreviated(followId);
                        const troupeJoined = await getTroupe(newsItemId);
                        if (!troupeMember || !troupeJoined) return null;
                        content = <p><Link className="link" href={`/profile/${troupeMember.id}`}>{troupeMember.name}</Link>{otherData === 'coach' ? ' is coaching ' : ' has joined the troupe, '}<Link className="link" href={`/troupes/${troupeJoined.id}`}>{troupeJoined.name}</Link>{otherData === 'musician' ? ' as a musical accompanist' : ''}.</p>
                        image = troupeMember.image || troupeJoined.image;
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