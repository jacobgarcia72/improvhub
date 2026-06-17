'use client'
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { removeCastMember } from "@/lib/shows";
import { Role } from "@/types";
import { useState } from "react";

export default function CastRoleBanner({ role, roleId, showId, dateTime, showTitle, teamName }: {
    role: Role | 'team',
    roleId: string | null,
    showTitle: string,
    showId: string,
    dateTime: string,
    teamName?: string,
}) {
    const [openModal, setOpenModal] = useState<boolean>(false);

    if (!roleId) return null;

    const handleDropOut = async () => {
        await removeCastMember(showId, dateTime, roleId, role);
        setOpenModal(false);
    }
    const show = `${showTitle}, ${formatDateTimeForDisplay(dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':'))}`;
    return <>
        <ConfirmModal
            open={openModal}
            title={role === 'team' ? (
                `Withdraw team from show?`
            ) : `Drop out of show?`}
            description={role === 'team' ? (
                `Confirm that ${teamName} would like to drop out of ${show}, and that you are authorized to make this decision on the team's behalf.`
            ) : `Are you sure you want to drop out of ${show}?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleDropOut}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
        />
        <div className="flex flex-row flex-wrap gap-1 justify-between items-center py-2 px-6 min-h-[58px] my-2 bg-lime-500/40 rounded border border-green-800">
            <p>{role === 'team' ? (
                `Your team, ${teamName}, is playing in this show`
            ) : `You are in this show as a ${role}`}</p>
            <div className="flex justify-end grow-1">
                <Button
                    caption={role === 'team' ? (
                        `Withdraw Team`
                    ) : `Drop Out`}
                    className="small dark"
                    onClick={() => setOpenModal(true)}
                />
            </div>
        </div>
    </>
}