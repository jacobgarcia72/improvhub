import ChatRoomSelect from "./chat-room-select";
import { InputOptionObject } from "@/types";

export default function MessagesHeader({ chatRooms }: {
    chatRooms: {
        theatres: InputOptionObject[],
        teams: InputOptionObject[]
    }
}) {
    return (
        <section>
            <div className="flex flex-row justify-between items-center">
                <ChatRoomSelect chatRooms={chatRooms} />
            </div>
        </section>
    )
}