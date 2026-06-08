'use client'

import Checkbox from "@/components/form/checkbox"
import { updateUser } from "@/lib/users"
import { User } from "@/types"
import { useState } from "react"

export default function OpenToCheckbox({ user, openToKey, label }: {
    openToKey: string,
    label: string,
    user: User
}) {
    const [pending, setPending] = useState(false);
    return (
        <div className="pl-3 pt-1">
            <Checkbox
                disabled={pending}
                defaultChecked={Boolean(user[openToKey as keyof User])}
                onChange={async (checked) => {
                    setPending(true);
                    await updateUser({ [openToKey]: checked });
                    setPending(false);
                }}
                name={openToKey}
                label={label} />
        </div>
    )
}