'use client';

import ConfirmModal from "@/components/confirm-modal";
import XButton from "@/components/form/x";
import { deleteComment, deletePost } from "@/lib/chat";
import { useState } from "react";

export default function DeletePost({ postId, commentId }: { postId: string, commentId?: string }) {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const handleConfirm = async () => {
        if (commentId) {
            await deleteComment(commentId, postId);
        } else {
            await deletePost(postId);
        }
        setOpenModal(false);
    }
    return <>
        <ConfirmModal
            open={openModal}
            title={`Delete ${commentId ? 'Comment' : 'Post'}?`}
            description={`Are you sure you want to delete this ${commentId ? 'comment' : 'post'}?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel="Yes"
            cancelLabel="No"
        />
        <XButton onClick={() => setOpenModal(true)} />
    </>
}