import EventDatePage from "@/components/event-page-layout/[dateTime]/event-date-page";

export default async function JamDatePage(
    { params } : { params: Promise<{id: string, dateTime: string}> }
){
    const { id, dateTime } = await params;
    return <EventDatePage id={id} dateTime={dateTime} type="jam" />
}