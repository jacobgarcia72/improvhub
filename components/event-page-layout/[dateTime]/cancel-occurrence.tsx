'use client'
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { pluralize } from "@/lib/helper-functions";
import { deleteOccurrence } from "@/lib/shows";
import { EventType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CancelOccurrence({ dateTime, eventTitle, eventId, type }: {
    eventTitle: string,
    eventId: string,
    dateTime: string,
    type: EventType
}) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleConfirm = async () => {
        await deleteOccurrence(eventId, dateTime, type);
        setOpenModal(false);
        router.push(`/${pluralize(type)}/${eventId}/`, { scroll: true });
    }
    const event = `${eventTitle}, ${formatDateTimeForDisplay(dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':'))}`;
    return <>
        <ConfirmModal
            open={openModal}
            title={`Cancel ${type} occurrence?`}
            description={`Are you sure you want to cancel ${event}?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel="Yes"
            cancelLabel="No"
        />
        <Button
            style="link"
            caption="Cancel Occurrence"
            onClick={() => setOpenModal(true)}
        />
    </>
}