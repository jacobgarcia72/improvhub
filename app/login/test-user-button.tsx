'use client'
import Button from "@/components/form/button";

export default function TestUserButton() {
    return <Button onClick={() => {
        window.location.href = '/login?test=true';
    }} style="link" caption="Use Test User" />
}