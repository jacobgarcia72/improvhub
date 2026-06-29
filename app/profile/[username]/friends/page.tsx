import FollowerList from "@/components/follower-list";
import { getFriends } from "@/lib/users";
import Link from "next/link";

export default async function UserFollowers({ params }: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params;
    const friends = await getFriends(username);
    return (
        <section>
            <div className="px-6">
                <Link href={`/profile/${username}`} className="link">Back</Link>
                <FollowerList followers={friends} caption="Friends" />
                {friends.length > 50 && (
                    <div className="pt-4">
                        <Link href={`/profile/${username}`} className="link">Back</Link>
                    </div>
                )}
            </div>
        </section>
    )
}