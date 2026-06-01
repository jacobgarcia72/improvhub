'use client';

import Button from "@/components/form/button";
import { respondToTeamInvitation } from "@/lib/teams";
import { useState } from "react";

export default function TeamInvitationOptions({ teamId, userId }: { teamId: string, userId: string }) {
    const [ accepted, setAccepted ] = useState<boolean | null>(null);

    return (
        <div className="flex flex-row gap-2 pt-1">
            {accepted === null && <>
                <Button caption="Accept" className="small green"
                    onClick={() => {
                        respondToTeamInvitation(teamId, userId, true);
                        setAccepted(true);
                    }}
                />
                <Button caption="Reject" className="small red"
                    onClick={() => {
                        respondToTeamInvitation(teamId, userId, false);
                        setAccepted(false);
                    }}
                />
            </>}
            {accepted === true && <p className="text-green-700">Invitation accepted</p>}
            {accepted === false && <p className="text-red-700">Invitation rejected</p>}
        </div>
    )
}