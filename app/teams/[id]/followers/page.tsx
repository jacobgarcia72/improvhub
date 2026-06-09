import FollowerList from "@/components/follower-list";
import { getFollows } from "@/lib/users";
import Link from "next/link";

export default async function TeamFollowers({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id: teamId } = await params;
    const followers = await getFollows(teamId, 'team');
    return (
        <section>
            <div className="px-6">
                <Link href={`/teams/${teamId}`} className="link">Back</Link>
                <FollowerList followers={followers} />
                {followers.length > 50 && (
                    <div className="pt-4">
                        <Link href={`/teams/${teamId}`} className="link">Back</Link>
                    </div>
                )}
            </div>
        </section>
    )
}