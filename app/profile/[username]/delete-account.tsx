'use client'

import ConfirmModal from "@/components/confirm-modal";
import Button from "@/components/form/button";
import { deleteUser } from "@/lib/users";
import { User } from "@/types";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function DeleteAccount({ user }: { user: User}) {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleConfirm = async () => {
        await deleteUser(user);
        setOpenModal(false);
        redirect('/login')
    }
    return <>
        <ConfirmModal
            open={openModal}
            title={`Delete Account?`}
            description={`Are you sure you want to delete your account?`}
            onCancel={() => setOpenModal(false)}
            onConfirm={handleConfirm}
            confirmLabel="Confirm"
            cancelLabel="Cancel"
            danger
        />
        <Button
            style='link'
            className="text-red-700!"
            caption="Delete Account"
            onClick={() => setOpenModal(true)}
        />
    </>
}