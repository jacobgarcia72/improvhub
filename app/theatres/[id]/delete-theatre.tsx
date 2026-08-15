'use client'
import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTheatre({ theatreId, theatreName }: {
    theatreName: string,
    theatreId: string,
}) {
    const router = useRouter();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [pending, setPending] = useState<boolean>(false);

    const handleConfirm = async () => {
        try {
            setPending(true);
            const res = await fetch(`/api/theatre?id=${encodeURIComponent(theatreId)}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete theatre');
            setOpenModal(false);
            router.push(`/theatres/`, { scroll: true });
        } catch (e) {
            console.error(e);
        } finally {
            setPending(false);
        }
    }
    return <div className="w-full flex flex-row justify-center mt-4">
        <ConfirmModal
            open={openModal}
            title="Delete Theatre?"
            description={`Are you sure you want to delete ${theatreName}? This action cannot be undone.`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel={pending ? 'Deleting...' : 'Confirm'}
            cancelLabel="Cancel"
            danger
        />
        <Button
            style='link'
            caption="Delete Theatre"
            onClick={() => setOpenModal(true)}
        />
    </div>
}
