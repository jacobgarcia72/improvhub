'use client'
import { capitalize } from "@/lib/helper-functions";
import { optimizeImage } from "@/lib/optimize-image";
import { User } from "@/types";
import Image from "next/image";
import ProfileImageCameraButton from "./profile-image-camera-button";
import CoverPhoto from "@/components/cover-photo";

export default function UserDetails({ user, userRoles, editable = false }: {
    user: User,
    userRoles?: { [role: string]: boolean },
    editable?: boolean
}) {
    const initials = user.firstName[0] + user.lastName[0];
    const displayName = `${user.firstName} ${user.lastName}`;
    return <>
        {user.coverImage ? (
            <div className="relative -mb-14">
                <CoverPhoto full src={user.coverImage} alt={`${displayName} cover photo`} />
                {editable ? <ProfileImageCameraButton type="cover" /> : null}
            </div>
        ) : editable ? (
            <div className="relative h-10 -mb-6">
                <ProfileImageCameraButton type="cover" action="Add" />
            </div>
        ) : null}
        <div className="flex flex-row items-end">
            <div className="relative pl-4">
                {user.image ? (
                    <Image loading="eager" className="object-cover rounded-xl w-32 h-32"
                        src={optimizeImage(user.image, 320, 320, null, true)} alt={displayName} width={120} height={120} />
                ) : (
                    <div className="rounded-xl h-32 w-32 bg-mist-500 flex justify-center items-center align-center">
                        <div className="text-white text-5xl font-extralight cursor-default">{initials}</div>
                    </div>
                )}
                {editable ? <ProfileImageCameraButton type="profile" action={user.image ? 'Change' : 'Add'} /> : null}
            </div>
            <div className="bg-(--section) rounded-lg pl-3 py-1 flex flex-col justify-end text-mist-800 dark:text-mist-200">
                <h1 className="text-xl xs:text-2xl font-light">{displayName}{user.pronouns && <span className="text-sm">&nbsp;&nbsp;({user.pronouns})</span>}</h1>
                {userRoles ? <h2 className="pl-1 flex flex-row font-light text-mist-700 dark:text-mist-300">{Object.keys(userRoles).filter((role) => userRoles[role]).map((r) => r === 'player' ? 'improviser' : r).map(capitalize).join(`\u2002\u2022\u2002`)}</h2> : null}
            </div>
        </div>
    </>
}
