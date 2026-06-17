'use client'
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { deleteShow } from "@/lib/shows";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteShow({ showTitle, showId }: {
    showTitle: string,
    showId: string,
}) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleConfirm = async () => {
        await deleteShow(showId);
        setOpenModal(false);
        router.push(`/shows/`, { scroll: true });
    }
    return <div className="w-full flex flex-row justify-center mt-4">
        <ConfirmModal
            open={openModal}
            title={`Delete ${showTitle}?`}
            description={`Are you sure you want to delete ${showTitle} and all associated showings?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
        />
        <Button
            style='link'
            caption="Delete Show"
            onClick={() => setOpenModal(true)}
        />
    </div>
}