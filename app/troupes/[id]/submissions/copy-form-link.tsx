'use client'

import Button from "@/components/form/button";
import { useState } from "react";

export default function CopyFormLink({ href }: { href: string }) {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

    const copyLink = async () => {
        const url = new URL(href, window.location.origin).toString();
        try {
            await navigator.clipboard.writeText(url);
            setCopyStatus('copied');
        } catch {
            setCopyStatus('failed');
        }
        window.setTimeout(() => setCopyStatus('idle'), 2000);
    };

    return (
        <Button
            onClick={copyLink}
            style="link"
            className="link p-0! text-sm"
            caption={copyStatus === 'copied' ? "Copied!" : copyStatus === 'failed' ? "Copy Failed" : "Copy Form URL"}
        />
    )
}
