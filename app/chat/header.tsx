'use client'
import ChatRoomSelect from "./chat-room-select";
import Button from "@/components/form/button";
import Link from "next/link";
import { InputOptionObject } from "@/types";
import { useState } from "react";

export default function MessagesHeader({ chatRooms }: {
    chatRooms: {
        theatres: InputOptionObject[],
        teams: InputOptionObject[]
    }
}) {
    const [room, setRoom] = useState<string | null>(null)
    return (
        <section>
            <div className="flex flex-row justify-between items-center">
                <ChatRoomSelect chatRooms={chatRooms} onSelect={setRoom} />
                <Link 
                    onClick={(e) => {
                        if (!room) {
                        e.preventDefault();
                        }
                    }}
                    href={`/chat/new/${room}`}
                >
                    <Button disabled={!room} className="w-40" caption="New Post" />
                </Link>
            </div>
        </section>
    )
}