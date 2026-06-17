'use client'
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { deleteShowing } from "@/lib/shows";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelShowing({ dateTime, showTitle, showId }: {
    showTitle: string,
    showId: string,
    dateTime: string,
}) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleConfirm = async () => {
        await deleteShowing(showId, dateTime);
        setOpenModal(false);
        router.push(`/shows/${showId}/`, { scroll: true });
    }
    const show = `${showTitle}, ${formatDateTimeForDisplay(dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':'))}`;
    return <>
        <ConfirmModal
            open={openModal}
            title="Cancel show?"
            description={`Are you sure you want to cancel ${show}?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel="Yes"
            cancelLabel="No"
        />
        <Button
            className="small dark"
            caption="Cancel Show"
            onClick={() => setOpenModal(true)}
        />
    </>
}