'use client'
import { optimizeImage } from "@/lib/optimize-image";
import { InputOptionObject } from "@/types";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatRoomSelect({ chatRooms, onSelect }: {
    chatRooms: {
        theatres: InputOptionObject[],
        teams: InputOptionObject[]
    },
    onSelect?: (id: string | null) => void;
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const room = searchParams.get('room');

    const { teams, theatres } = chatRooms;
    const [isOpen, setIsOpen] = useState(false);

    const globalChatRoom = { text: 'Global', id: 'global', image: '/icons/globe.png' };

    const handleSelect = (roomId: string) => {
        replace(pathname);
        if (roomId) {
            params.delete('topic');
            params.set('room', roomId);
            replace(`${pathname}?${params.toString()}`);
        }
    }

    useEffect(() => {
        if (!room) handleSelect('global');
        if (onSelect) onSelect(room);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [room, onSelect]);

    const getChatRoomObject = (id: string): InputOptionObject | null => {
        if (id === 'global') return globalChatRoom;
        if (id.startsWith('team')) return teams.find(t => t.id === id) || null;
        if (id.startsWith('theatre')) return theatres.find(t => t.id === id) || null;
        return null;
    }

    const displayNameAndImage = ({ image, text }: InputOptionObject) => {
        return <>
            {image ? (
                <Image className="rounded-full" src={optimizeImage(image, 50, 50, 90, true, true)} alt={text} width={25} height={25} />
            ) : null}
            <span className={`whitespace-nowrap ${image ? '' : 'pl-10'}`}>{text}</span>
        </>
    }

    function ChatRoomOption(chatRoom: InputOptionObject) {
        return (
            <div onClick={() => handleSelect(chatRoom.id.toString())} key={chatRoom.id} className="w-full py-2 px-4 cursor-pointer hover:bg-blue-500 hover:text-white flex flex-row gap-2">
                {displayNameAndImage(chatRoom)}
            </div>
        )
    }

    return <div className="flex flex-col">
        <div className="label mt-[-6px]">Chat Room</div>
        <div onClick={() => setIsOpen(!isOpen)} className="relative">
            {isOpen ? <>
                <div
                    onClick={() => setIsOpen(false)}
                    className="z-0 cursor-pointer w-full h-full fixed left-0 top-0"
                ></div>
                <div className="max-h-72 overflow-y-scroll overflow-x-hidden z-50 dropdown bg-white/90 border-gray-300 border-1 rounded absolute top-9.5 w-86 max-w-[90vw] flex flex-col">
                    {ChatRoomOption(globalChatRoom)}
                    {theatres.map(ChatRoomOption)}
                    {teams.map(ChatRoomOption)}
                </div>
            </> : null}
            <div
                className="cursor-pointer flex items-center px-4 h-10 w-86 max-w-[90vw] transition-colors mb-0.5 bg-white hover:bg-blue-500 text-gray-700 hover:text-white rounded-md border-1 border-gray-300"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-row items-center gap-1">{room && displayNameAndImage(getChatRoomObject(room) || globalChatRoom) || 'Select Chat Room'}</div>
            </div>
        </div>
    </div>
}