import Form from "@/components/form/form";
import Input from "@/components/form/input"
import Text from "@/components/form/text"
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/users";
import { getChatRooms } from "@/lib/chat";
import ChatRoomSelect from "../chat-room-select";
import { postTopic } from "@/actions/chat-actions";
import { SearchParams } from "next/dist/server/request/search-params";
import { Theatre } from "@/types";
import { getTheatre } from "@/lib/theatres";

export default async function NewChatPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const userId = await getCurrentUserId();
    if (!userId) {
        redirect(`/login?reroute=discuss`);
    }
    const params = await searchParams;
    const channel = params.channel as string;
    if (!channel) {
        redirect(`/discuss`);
    }

    const chatRooms = await getChatRooms(userId);
    let theatre: Theatre | null = null;
    if (typeof channel === 'string' && channel.startsWith('theatre-')) {
        const theatreId = channel.split('-').slice(1).join('-');
        theatre = await getTheatre(theatreId);
    }

    const handleCancel = async () => {
        'use server'
        redirect(`/discuss?channel=${channel}`);
    }
    return (
        <>
        <section className="flex flex-col gap-1 w-[410px]! max-w-[calc(90vw+12px)]!">
            <ChatRoomSelect chatRooms={chatRooms} theatre={theatre} />
            <Form className="gap-1 w-full" onSubmit={postTopic.bind(null, userId, channel)} cancel={handleCancel}>
                <Input autocomplete={false} name="topic" label="Topic" max={20} required className="w-86 max-w-[90vw]" />
                <Text name="description" label="Description" rows={3} />
            </Form>
        </section>
        </>
    )
}