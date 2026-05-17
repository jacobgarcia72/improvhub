'use client'

import Input from "@/components/form/input"
import { validateInputValue } from "@/lib/helper-functions";
import { useState } from "react";

export default function UsernameInput() {
    const [username, setUsername] = useState('');
    const [showError, setShowError] = useState(false);

    return (
        <div className='relative'>
            <Input
                value={username}
                onChange={(value) => {
                    if (validateInputValue(value, 'username')) {
                        setUsername(value);
                        setShowError(false);
                    } else {
                        setShowError(true);
                    }
                }}
                label="Username"
                name="username"
                maxLength={20}
            />
            {showError && <p className="absolute border border-slate-700 rounded bg-slate-100 px-2 text-slate-900 text-xs ml-1.5">No special characters</p>}
        </div>
    )
}