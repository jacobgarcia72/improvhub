import { getUser } from "@/lib/users";
import { User } from "@/types";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function UserProfilePage({ params }: { params: Promise<{username: string}> }) {

    const { username } = await params;
    const user = await getUser(username) as User | undefined;
    console.log('username', username)

    console.log('user', user)
    if (!user) notFound();
    return (
        <Suspense fallback={<p>Loading</p>}>
            <h1>`${user.first_name}${user.last_name ? ' ' + user.last_name?.slice(0, 1) + '.' : ''}`</h1>
        </Suspense>
    )
}