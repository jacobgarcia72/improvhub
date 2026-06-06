"use client"

import { useState } from "react";
import Button from "./form/button";
import ConfirmModal from "./confirm-modal";

export default function LeaveTeamConfirm({ caption = 'Leave Team' }: { caption?: string }) {
    const [open, setOpen] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOpen(true);
    }

    const handleConfirm = () => {
        // find nearest form and submit
        const forms = document.getElementsByTagName('form');
        // try to submit the last form on the page (closest is preferred but simple fallback)
        let form: HTMLFormElement | null = null;
        try {
            const active = document.activeElement as HTMLElement | null;
            if (active) {
                const maybe = active.closest('form') as HTMLFormElement | null;
                if (maybe) form = maybe;
            }
        } catch {}
        if (!form) form = forms[forms.length - 1] as HTMLFormElement | null;
        if (form) form.submit();
        setOpen(false);
    }

    return (
        <>
            <Button submit caption={caption} style="link" onClick={(e) => handleClick(e)} />
            <ConfirmModal
                open={open}
                title="Leave team"
                description="Are you sure you want to leave this team?"
                onCancel={() => setOpen(false)}
                onConfirm={handleConfirm}
                confirmLabel="Leave"
                cancelLabel="Cancel"
            />
        </>
    )
}
