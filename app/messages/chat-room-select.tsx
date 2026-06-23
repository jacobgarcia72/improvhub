'use client'
import Button from "@/components/form/button";
import { optimizeImage } from "@/lib/optimize-image";
import { InputOptionObject } from "@/types";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ChatRoomSelect({ chatRooms }: {
    chatRooms: {
        theatres: InputOptionObject[],
        teams: InputOptionObject[]
    }
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const params = new URLSearchParams(searchParams);
    const room = searchParams.get('room');

    const { teams, theatres } = chatRooms;
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (roomId: string) => {
        replace(pathname);
        if (roomId) {
            params.set('room', roomId);
            replace(`${pathname}?${params.toString()}`);
        }
    }
    function ChatRoomOption({ id, text, image }: InputOptionObject) {
        return (
            <div onClick={() => handleSelect(id.toString())} key={id} className="w-full py-2 px-4 cursor-pointer hover:bg-slate-500 hover:text-white flex flex-row gap-3">
                {image ? (
                    <Image src={optimizeImage(image, 50, 50, 90, true)} alt={text} width={25} height={25} />
                ) : null}
                <span className={`whitespace-nowrap ${image ? '' : 'pl-10'}`}>{text}</span>
            </div>
        )
    }

    return <>
        <div onClick={() => setIsOpen(!isOpen)} className="relative">
            {isOpen ? <>
                <div
                    onClick={() => setIsOpen(false)}
                    className="z-0 cursor-pointer w-full h-full fixed left-0 top-0"
                ></div>
                <div className="max-h-72 overflow-y-scroll overflow-x-hidden z-50 dropdown bg-white/90 border-gray-300 border-1 rounded absolute top-9.5 w-86 max-w-[90vw] flex flex-col">
                    {ChatRoomOption({ id:"global", text:"Global" })}
                    {theatres.map(ChatRoomOption)}
                    {teams.map(ChatRoomOption)}
                </div>
            </> : null}
            <Button caption={room || 'Select Room'} onClick={() => setIsOpen(!isOpen)} />
        </div>
    </>
}