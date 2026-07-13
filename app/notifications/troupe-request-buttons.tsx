'use client'

import Button from "@/components/form/button"
import { respondToTroupeInvitation } from "@/lib/troupes";
import { useState } from "react"

export default function TroupeRequestButtons({ troupeId, userId, role, notifId }: { troupeId: string, userId: string, role: string, notifId: string }) {
    const [pending, setPending] = useState(false);
    const deleteNotif = async (id: string) => {
    await fetch(`/api/notification?id=${encodeURIComponent(id)}&user=${encodeURIComponent(userId)}`, {
        method: 'DELETE'
    });
    };
    return (
        <div className="flex flex-row gap-2">
            <Button disabled={pending} onClick={async () => {
                setPending(true);
                await respondToTroupeInvitation(troupeId, userId, role, true);
                setPending(false);
            }} caption="Accept" className="small green" />
            <Button disabled={pending} onClick={async () => {
                setPending(true);
                await respondToTroupeInvitation(troupeId, userId, role, false);
                await deleteNotif(notifId);
                setPending(false);
            }} caption="Decline" className="small red" />
        </div>
    )
}