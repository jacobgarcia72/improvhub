import { getIsASeries, getShow, getShowing } from "@/lib/shows";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import ShowDetails from "../show-details";
import ShowHeader from "../show-header";
import ShowDate from "./show-date";
import { dateMatchesRecurringSchedule } from "@/lib/dates";
import Showing from "./showing";

export default async function ShowDatePage({ params } : {
    params: Promise<{ id: string, dateTime: string }>
    }) {
    const { id, dateTime } = await params;

    const parentShow = id ? await getShow(id) : null;
    if (!parentShow) notFound();

    const showDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const showing = id ? await getShowing(id, showDate) : null;
    const { recurringDay, recurringTime, cadence } = parentShow;
    const showingExists = Boolean(showing) || (cadence && dateMatchesRecurringSchedule(showDate, recurringDay, cadence, recurringTime));
    const isASeries = showingExists && (cadence || await getIsASeries(id));
    if (!showingExists || !isASeries) redirect(`/shows/${id}`);

    return <>
        <ShowHeader show={parentShow}>
            <ShowDate showDate={showDate} />
            <Link className="link pb-2 text-sm mt-[-4px]" href={`/shows/${id}`}>Go to parent show page</Link>
        </ShowHeader>
        <Showing id={id} dateTime={showDate} parentShow={parentShow} isASeries />
        <ShowDetails show={parentShow} />
    </>
}