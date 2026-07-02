'use client'
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { pluralize } from "@/lib/helper-functions";
import { deleteEvent } from "@/lib/shows";
import { EventType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteEvent({ eventTitle, eventId, isASeries, type }: {
    eventTitle: string,
    eventId: string,
    isASeries: boolean,
    type: EventType
}) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleConfirm = async () => {
        await deleteEvent(eventId, type);
        setOpenModal(false);
        router.push(`/${pluralize(type)}/`, { scroll: true });
    }
    return <div className="w-full flex flex-row justify-center mt-4">
        <ConfirmModal
            open={openModal}
            title={`Delete ${eventTitle}?`}
            description={`Are you sure you want to delete ${eventTitle}${isASeries ? ' and all associated occurrences in the series' : ''}?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
        />
        <Button
            style='link'
            caption={`Delete ${isASeries ? 'Series' : 'Event'}`}
            onClick={() => setOpenModal(true)}
        />
    </div>
}