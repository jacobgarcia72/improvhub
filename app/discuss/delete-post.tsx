'use client';

import ConfirmModal from "@/components/confirm-modal";
import XButton from "@/components/form/x";
import { deletePost } from "@/lib/chat";
import { useState } from "react";

export default function DeletePost({ postId }: { postId: string }) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleConfirm = async () => {
        await deletePost(postId);
        setOpenModal(false);
    }
    return <>
        <ConfirmModal
            open={openModal}
            title={`Delete Post?`}
            description={`Are you sure you want to delete this post?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel="Yes"
            cancelLabel="No"
        />
        <XButton onClick={() => setOpenModal(true)} />
    </>
}