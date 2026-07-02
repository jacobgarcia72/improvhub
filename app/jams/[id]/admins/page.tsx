import EventAdminsPage from "@/components/event-page-layout/admins/event-admins-page";

export default async function JamAdminsPage({ params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    return <EventAdminsPage id={id} type="jam" />
}