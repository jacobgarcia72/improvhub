import ChatRoomSelect from "./chat-room-select";
import { InputOptionObject, Theatre } from "@/types";

export default function MessagesHeader({ chatRooms, theatre }: {
    chatRooms: {
        theatres: InputOptionObject[],
        troupes: InputOptionObject[]
    },
    theatre?: Theatre | null
}) {
    return (
        <section>
            <div className="flex flex-row justify-between items-center">
                <ChatRoomSelect chatRooms={chatRooms} theatre={theatre} />
            </div>
        </section>
    )
}