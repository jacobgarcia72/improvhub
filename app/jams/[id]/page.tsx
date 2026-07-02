import EventDetailsPage from "@/components/event-page-layout/event-details-page";

export default async function JamDetailsPage({ params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    return <EventDetailsPage id={id} type="jam" />
}