'use client'

import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button"
import { getPronounForm } from "@/lib/demographics";
import { addTroupeMember } from "@/lib/troupes";
import { useState } from "react";

export default function AddToTroupe({ userId, userFullName, userFirstName, userLastName, troupeId, troupeName, pronouns, currentUserId, isInTroupe }: { userId?: string, userFullName?: string, userFirstName?: string, userLastName?: string, troupeId: string, troupeName: string, pronouns?: string | null, currentUserId?: string, isInTroupe?: boolean }) {
    const [pending, setPending] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [isAdded, setIsAdded] = useState<boolean>(isInTroupe || false);

    return <>
        <ConfirmModal
            open={openModal}
            title={`Add ${userFirstName || userFullName} to ${troupeName}?`}
            description={userId ? `${userFirstName || userFullName} will receive a notification asking ${pronouns ? getPronounForm(pronouns, 1) : 'them'} to confirm ${pronouns ? getPronounForm(pronouns, 2) : 'their'} membership in ${troupeName}.` : ''}
            onCancel={() => setOpenModal(false)}
            onConfirm={async () => {
                setPending(true);
                await addTroupeMember(troupeId, userId || null, userFullName || `${userFirstName} ${userLastName}`, 'player', currentUserId, true);
                setOpenModal(false);
                setIsAdded(true);
                setPending(false);
            }}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
        />
        <Button
            onClick={() => setOpenModal(true)}
            disabled={pending || isAdded}
            style="link"
            className="link p-0!"
            caption={isAdded ? 'Added' : 'Add to Troupe'}
        />
    </>
}