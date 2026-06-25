import Form from "@/components/form/form";
import Input from "@/components/form/input"
import Text from "@/components/form/text"
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/users";
import { getChatRooms } from "@/lib/chat";
import ChatRoomSelect from "../chat-room-select";
import { postTopic } from "@/actions/chat-actions";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function NewChatPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const userId = await getCurrentUserId();
    if (!userId) {
        redirect(`/login?reroute=chat`);
    }
    const params = await searchParams;
    const room = params.room as string;
    if (!room) {
        redirect(`/chat`);
    }

    const chatRooms = await getChatRooms(userId);

    const handleCancel = async () => {
        'use server'
        redirect(`/chat?room=${room}`);
    }
    return (
        <>
        <section className="flex flex-col gap-1 w-[410px]! max-w-[calc(90vw+12px)]!">
            <ChatRoomSelect chatRooms={chatRooms} />
            <Form className="gap-1 w-full" onSubmit={postTopic.bind(null, userId, room)} cancel={handleCancel}>
                <Input autocomplete={false} name="topic" label="Topic" max={20} required className="w-86 max-w-[90vw]" />
                <Text name="description" label="Description" rows={3} />
            </Form>
        </section>
        </>
    )
}