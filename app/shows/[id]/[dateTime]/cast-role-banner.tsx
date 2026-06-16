'use client'
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { removeCastMember } from "@/lib/shows";
import { Role } from "@/types";
import { useState } from "react";

export default function CastRoleBanner({ role, userId, showId, dateTime, showTitle }: {
    role: Role | 'team',
    userId: string | null,
    showTitle: string,
    showId: string,
    dateTime: string
}) {
    const [openModal, setOpenModal] = useState<boolean>(false);

    if (!userId) return null;

    const handleDropOut = async () => {
        await removeCastMember(showId, dateTime, userId, role);
        setOpenModal(false);
    }

    return <>
        <ConfirmModal
            open={openModal}
            title="Drop out of show?"
            description={`Are you sure you want to drop out of ${showTitle}, ${formatDateTimeForDisplay(dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':'))}?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleDropOut}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
        />
        <div className="flex flex-row flex-wrap justify-between items-center py-2 px-6 min-h-[58px] my-2 bg-lime-500/40 rounded border border-green-800">
            <p>{`You are in this show as a ${role}`}</p>
            <div>
                <Button
                    caption="Drop Out"
                    className="small"
                    onClick={() => setOpenModal(true)}
                />
            </div>
        </div>
    </>
}