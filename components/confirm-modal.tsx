"use client"

import Button from "./form/button";

export default function ConfirmModal({ open, title, description, onConfirm, onCancel, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }: {
    open: boolean,
    title?: string,
    description?: string,
    onConfirm: () => void,
    onCancel: () => void,
    confirmLabel?: string,
    cancelLabel?: string,
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-80" onClick={onCancel}></div>
            <div className="relative bg-white rounded shadow-lg w-11/12 max-w-md p-6">
                {title ? <h3 className="text-lg mb-2">{title}</h3> : null}
                {description ? <p className="text-sm text-gray-700 mb-4">{description}</p> : null}
                <div className="flex justify-end">
                    <Button style="link" onClick={onCancel} caption={cancelLabel} />
                    <Button onClick={onConfirm} caption={confirmLabel} />
                </div>
            </div>
        </div>
    )
}
