'use client';

import Button from "@/components/form/button";
import { respondToTroupeInvitation } from "@/lib/troupes";
import { useState } from "react";

export default function TroupeInvitationOptions({ troupeId, userId, role }: { troupeId: string, userId: string, role: string }) {
    const [ accepted, setAccepted ] = useState<boolean | null>(null);

    return (
        <div className="flex flex-row gap-2 pt-1">
            {accepted === null && <>
                <Button caption="Accept" className="small green"
                    onClick={() => {
                        respondToTroupeInvitation(troupeId, userId, role, true);
                        setAccepted(true);
                    }}
                />
                <Button caption="Reject" className="small red"
                    onClick={() => {
                        respondToTroupeInvitation(troupeId, userId, role, false);
                        setAccepted(false);
                    }}
                />
            </>}
            {accepted === true && <p className="text-green-700">Invitation accepted</p>}
            {accepted === false && <p className="text-red-700">Invitation rejected</p>}
        </div>
    )
}