'use client'

import Button from "@/components/form/button"
import { acceptFriendRequest, deleteFriendRequest } from "@/lib/users"

export default function FriendRequestButtons({ yourId, thierId, notifId }: { yourId: string, thierId: string, notifId: string }) {
    return (
        <div className="flex flex-row gap-2">
            <Button onClick={() => acceptFriendRequest(thierId, yourId)} caption="Accept" className="small green" />
            <Button onClick={() => {
                deleteFriendRequest(thierId, yourId);
                // deleteNotification(notifId);
            }} caption="Decline" className="small red" />
        </div>
    )
}