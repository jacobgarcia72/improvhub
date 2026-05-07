import { getUser } from "@/lib/users";
import { User } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function UserProfilePage({ params }: { params: Promise<{username: string}> }) {

    const { username } = await params;
    const user = await getUser(username) as User | undefined;

    if (!user) notFound();
    let displayName = user.firstName;
    if (user.lastName) displayName += ` ${user.lastName.slice(0, 1)}.`
    return (
        <Suspense fallback={<p>Loading</p>}>
            <h1>{displayName}</h1>
        </Suspense>
    )
}