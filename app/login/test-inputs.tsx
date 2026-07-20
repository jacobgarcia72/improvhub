'use client'

import Input from "@/components/form/input";

const testUser = `test-user-${Math.ceil(Math.random() * 100)}`;
export default function TestInputs() {
    return (
        <>
            <Input value={`${testUser}@test.com`} required name="email" type="email" label="Email" />
            <Input value={testUser} required name="password" label="Password" />
        </>
    )
}