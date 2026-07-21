import { getTopics, getPosts } from "@/lib/chat"
import TopicCard from "./topic-card";
import { Suspense } from "react";
import Loader from "@/components/loader";
import Button from "@/components/form/button";
import Link from "next/link";
import NewPostForm from "./new-post-form";
import PostCard from "./post-card";
import { User } from "@/types";

export default async function MessagesBody({ user, room, topic }: { user: User, room: string | null, topic: string | null }) {
    if (!room) {
        return (
            <section>
                <p>Select Discussion Board</p>
            </section>
        )
    } else if (topic) {
        const posts = await getPosts(room, topic);
        return (
            <section>
                {user ? (
                    <NewPostForm user={user} room={room} topic={topic} />
                ): <Link href='/login'>Sign in to create post</Link>}
                <div className="flex flex-col gap-2 items-center">
                    <Suspense fallback={<Loader />}>
                        {posts.map((p) => <PostCard key={p.id} post={p} user={user} room={room} topic={topic} />)}
                        {posts.length === 0 && <p className="text-mist-600">No posts found.</p>}
                    </Suspense>
                </div>
            </section>
        )
    } else {
        const topics = await getTopics(room);
        return (
            <section className="flex flex-col gap-1.5">
                <Suspense fallback={<Loader />}>
                    {topics.map((t) => <TopicCard topic={t} key={t.id} />)}
                </Suspense>
                <div className="pt-1.5">
                    <Link
                        href={`/discuss/new-topic?channel=${room}`}
                    >
                        <Button className="w-48" caption="New Topic" />
                    </Link>
                </div>
            </section>
        )
    }
}