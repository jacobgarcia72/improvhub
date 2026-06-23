import { getChatRooms } from "@/lib/chat"
import { getCurrentUserId } from "@/lib/users";
import { redirect } from "next/navigation";
import ChatRoomSelect from "./chat-room-select";

export default async function MessagesLayout() {
    const userId = await getCurrentUserId();
    if (!userId) {
        redirect(`/login?reroute=messages`);
    }
    const chatRooms = await getChatRooms(userId);
    return (
        <section>
            <div className="flex flex-row">
                <ChatRoomSelect chatRooms={chatRooms} />
            </div>
        </section>
    )
}