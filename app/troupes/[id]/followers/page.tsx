import FollowerList from "@/components/follower-list";
import { getCurrentUserId, getFollows } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TroupeFollowers({ params }: {
    params: Promise<{ id: string }>
}) {
    const currentUserId = await getCurrentUserId();
    if (!currentUserId) notFound();
    const { id: troupeId } = await params;
    const followers = await getFollows(troupeId, 'troupe');
    return (
        <section>
            <div className="px-6">
                <Link href={`/troupes/${troupeId}`} className="link">Back</Link>
                <FollowerList followers={followers} />
                {followers.length > 50 && (
                    <div className="pt-4">
                        <Link href={`/troupes/${troupeId}`} className="link">Back</Link>
                    </div>
                )}
            </div>
        </section>
    )
}