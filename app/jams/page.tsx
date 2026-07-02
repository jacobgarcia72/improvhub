import { Metadata } from "next";
import { appName } from "@/lib/app-info";
import { getCurrentUser } from "@/lib/users";
import Link from "next/link";
import Button from "@/components/form/button";

export const metadata: Metadata = {
    title: `Improv Jams | ${appName}`,
};

export default async function JamsPage() {
    const user = await getCurrentUser();
    return (
        <>
            <section className="flex flex row gap-2">
                <Link href="/create/jam">
                    <Button caption="New Jam" />
                </Link>
                <Link href="/search?for=jams">
                    <Button caption="Find Jams" />
                </Link>
            </section>
            {!user && <section className="min-h-32 flex flex-col items-center justify-center gap-2">
                <p className="mb-2"><Link className="link" href="/login">Sign in</Link> to create and manage improv jams!</p>
            </section>}
        </>
    )
}