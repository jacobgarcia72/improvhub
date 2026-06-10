import FollowerList from "@/components/follower-list";
import { getFollows } from "@/lib/users";
import Link from "next/link";

export default async function UserFollowers({ params }: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params;
    const followers = await getFollows(username, 'user');
    return (
        <section>
            <div className="px-6">
                <Link href={`/profile/${username}`} className="link">Back</Link>
                <FollowerList followers={followers} />
                {followers.length > 50 && (
                    <div className="pt-4">
                        <Link href={`/profile/${username}`} className="link">Back</Link>
                    </div>
                )}
            </div>
        </section>
    )
}