'use client'

import Input from "@/components/form/input";
import Loader from "@/components/loader";
import { getNumberOfTestUsers } from "@/lib/users";
import { useEffect, useState } from "react";

export default function TestInputs() {
    const [user, setUser] = useState<string>();
    useEffect(() => {
        const getTestUsers = async () => {
            const numUsers = await getNumberOfTestUsers();
            if (!numUsers) return;
            const testUser = `test-user-${Math.ceil(Math.random() * numUsers)}`;
            setUser(testUser);
        }
        getTestUsers();
    }, []);
    if (!user) return (
        <div className="flex justify-center flex-col items-center">
            <Loader />
            <p className="label">Getting test user...</p>
        </div>
    )
    return (
        <>
            <Input value={`${user}@test.com`} required name="email" type="email" label="Email" />
            <Input value={user} required name="password" label="Password" />
        </>
    )
}