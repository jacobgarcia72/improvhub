import { getChatRooms } from "@/lib/chat"
import { getCurrentUserId } from "@/lib/users";
import { redirect } from "next/navigation";
import MessagesHeader from "./header";
import MessagesBody from "./body";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function ChatPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const { room, topic } = await searchParams;
    const userId = await getCurrentUserId();
    if (!userId) {
        redirect(`/login?reroute=chate`);
    }
    const chatRooms = await getChatRooms(userId);
    return <>
        <MessagesHeader chatRooms={chatRooms} showPostButton />
        <MessagesBody room={room as string || null} topic={topic as string || null} />
    </>
}