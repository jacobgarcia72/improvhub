import FollowerList from "@/components/follower-list";
import { getFollowees } from "@/lib/users";
import Link from "next/link";

export default async function UserFollowees({ params }: {
    params: Promise<{ username: string }>
}) {
    const { username } = await params;
    const followees = await getFollowees(username, 'user');
    return (
        <section>
            <div className="px-6">
                <Link href={`/profile/${username}`} className="link">Back</Link>
                <FollowerList followers={followees} caption="Followees" />
                {followees.length > 50 && (
                    <div className="pt-4">
                        <Link href={`/profile/${username}`} className="link">Back</Link>
                    </div>
                )}
            </div>
        </section>
    )
}