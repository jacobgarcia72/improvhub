'use client'
import { optimizeImage } from "@/lib/optimize-image";
import { User } from "@/types";
import Image from "next/image";

export default function UserDetails({ user } : { user: User }) {
    const initials = user.firstName[0] + user.lastName[0];
    const displayName = `${user.firstName} ${user.lastName}`;
    return <div className="flex flex-row">
        <div className="pl-4">
            {user.image ? (
                <Image loading="eager" className="object-cover rounded-xl w-32 h-32"
                    src={optimizeImage(user.image, 320, 320, null, true)} alt={displayName} width={120} height={120} />
            ) : (
                <div className="rounded-xl h-32 w-32 bg-mist-400 flex justify-center items-center align-center">
                    <div className="text-white text-5xl font-thin cursor-default">{initials}</div>
                </div>
            )}
        </div>
        <div className="p-3 flex flex-col justify-end text-mist-700">
            <h1 className="text-2xl font-thin">{displayName}{user.pronouns && <span className="text-sm">&nbsp;({user.pronouns})</span>}</h1>
        </div>
    </div>
}