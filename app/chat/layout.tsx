import { getChatRooms } from "@/lib/chat"
import { getCurrentUserId } from "@/lib/users";
import { redirect } from "next/navigation";
import MessagesHeader from "./header";

export default async function MessagesLayout() {
    const userId = await getCurrentUserId();
    if (!userId) {
        redirect(`/login?reroute=messages`);
    }
    const chatRooms = await getChatRooms(userId);
    return (
        <MessagesHeader chatRooms={chatRooms} />
    )
}