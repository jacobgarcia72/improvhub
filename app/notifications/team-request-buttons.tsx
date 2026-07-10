'use client'

import Button from "@/components/form/button"
import { respondToTeamInvitation } from "@/lib/teams";
import { useState } from "react"

export default function TeamRequestButtons({ teamId, userId, role, notifId }: { teamId: string, userId: string, role: string, notifId: string }) {
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
                await respondToTeamInvitation(teamId, userId, role, true);
                setPending(false);
            }} caption="Accept" className="small green" />
            <Button disabled={pending} onClick={async () => {
                setPending(true);
                await respondToTeamInvitation(teamId, userId, role, false);
                await deleteNotif(notifId);
                setPending(false);
            }} caption="Decline" className="small red" />
        </div>
    )
}