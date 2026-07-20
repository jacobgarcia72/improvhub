import { getChatRooms } from "@/lib/chat"
import { getCurrentUser } from "@/lib/users";
import { redirect } from "next/navigation";
import MessagesHeader from "./header";
import MessagesBody from "./body";
import { SearchParams } from "next/dist/server/request/search-params";
import { Metadata } from "next";
import { appName } from "@/lib/app-info";

export const metadata: Metadata = {
    title: `Discussions | ${appName}`
};

export default async function ChatPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const { room, topic } = await searchParams;
    const user = await getCurrentUser();
    if (!user) {
        redirect(`/login?reroute=chat`);
    }
    const chatRooms = await getChatRooms(user.id);
    return <>
        <MessagesHeader chatRooms={chatRooms} />
        <MessagesBody user={user} room={room as string || null} topic={topic as string || null} />
    </>
}
