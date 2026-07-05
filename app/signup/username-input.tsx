'use client'

import Input from "@/components/form/input"
import { validateInputValue } from "@/lib/helper-functions";
import { getUser } from "@/lib/users";
import { useState } from "react";

export default function UsernameInput() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState<string>();

    const checkIfExists = async () => {
        if (Boolean(await getUser(username))) {
            setError('Username unavailable');
        } else {
            setError('');
        }
    }

    return (
        <div className='relative'>
            <Input
                required
                value={username}
                onChange={(value) => {
                    if (validateInputValue(value, 'username')) {
                        setUsername(value);
                        setError('');
                    } else {
                        setError('No special characters');
                    }
                }}
                onBlur={checkIfExists}
                label="Username"
                name="username"
                maxLength={20}
            />
            {error && <p className="absolute border border-slate-700 rounded bg-slate-100 px-2 text-slate-900 dark:text-slate-100 text-xs ml-1.5">{error}</p>}
        </div>
    )
}