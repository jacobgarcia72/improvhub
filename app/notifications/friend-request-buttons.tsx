'use client'

import Button from "@/components/form/button"
import { acceptFriendRequest, deleteFriendRequest } from "@/lib/users"
import { useState } from "react"

export default function FriendRequestButtons({ yourId, thierId, notifId }: { yourId: string, thierId: string, notifId: string }) {
    const [pending, setPending] = useState(false);
    const deleteNotif = async (id: string) => {
    await fetch(`/api/notification?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
    });
    };
    return (
        <div className="flex flex-row gap-2">
            <Button disabled={pending} onClick={async () => {
                setPending(true);
                await acceptFriendRequest(thierId, yourId);
                setPending(false);
            }} caption="Accept" className="small green" />
            <Button disabled={pending} onClick={async () => {
                setPending(true);
                await deleteFriendRequest(thierId, yourId);
                await deleteNotif(notifId);
                setPending(false);
            }} caption="Decline" className="small red" />
        </div>
    )
}