import { postShowCast } from "@/actions";
import { Border } from "@/components/border";
import CastingInputs from "@/components/form/casting-inputs";
import Form from "@/components/form/form";
import { getShow, getShowCast, getEventOccurrence } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";
import { dateMatchesRecurringSchedule } from "@/lib/dates";
import EventHeader from "@/components/event-page-layout/event-header";
import EventDate from "@/components/event-page-layout/[dateTime]/event-date";

export default async function ShowCastPage({ params } : {
    params: Promise<{ id: string, dateTime: string, events: string }>
    }) {
    const { id, dateTime, events } = await params;
    if (events !== 'shows') notFound();
    const parentShow = id ? await getShow(id) : null;
    if (!parentShow) notFound();
    const showDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const showing = id ? await getEventOccurrence(id, showDate, 'show') : null;
    const { recurringDay, recurringTime, cadence } = parentShow;
    if (!(showing || (
        cadence && dateMatchesRecurringSchedule(showDate, recurringDay, cadence, recurringTime)
    ))) notFound();

    const userId = await getCurrentUserId();
    const cast = await getShowCast(id, dateTime);

    const isAdmin = userId && parentShow?.admins.includes(userId);
    const isDirector = userId && (
        cast.find((c) => c.id === userId && c.role === 'director')
    );
    if (!(isAdmin || isDirector)) notFound();

    const onCancel = async () => {
        'use server'
        redirect(`/shows/${id}/${dateTime}`);
    }

    return <>
        <EventHeader event={parentShow} eventImage={false} />
        <EventDate eventDate={showDate} type="show" />
        <Border className="py-2 px-4 my-1">
            <Form
                buttonCaption="Save Cast"
                cancel={onCancel}
                onSubmit={postShowCast.bind(null, id, dateTime)}>
                <CastingInputs
                    currentCast={cast}
                    roles={['director', 'tech', 'troupe', 'player', 'musician']}
                />
            </Form>
        </Border>
    </>
}