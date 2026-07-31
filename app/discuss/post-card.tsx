import { getUser } from "@/lib/users";
import { DiscussionPost, User } from "@/types";
import UserImage from "./user-image";
import { getComments } from "@/lib/chat";
import Link from "next/link";
import DeletePost from "./delete-post";
import Comments from "./comments";
import PostCardToggle from "./post-card-toggle";
import CommentCount from "./comment-count";

export default async function PostCard({ post, user, room, topic }: { post: DiscussionPost, user: User, room: string, topic: string }) {
    const { post: body } = post;
    const poster = await getUser(post.creator);
    const comments = await getComments(room, topic, post.id);
    return (
        <PostCardToggle
            avatar={poster ? (
                <div className="mt-[2px]">
                    <UserImage square user={poster} />
                </div>
            ) : null}
            collapsedComments={<CommentCount count={comments.length} />}
            expandedComments={<Comments user={user} comments={comments} post={post} />}
        >
            <div className="flex flex-row">
                <p className="text-mist-900 dark:text-mist-100 grow-1"><span className="text-blue-500 text-[0.9em]">
                    {poster ? (
                        <Link href={`/profile/${poster.id}`}>{`${poster.firstName} ${poster.lastName[0]}`}</Link>
                    ): '[deleted]'}:</span>&nbsp;{body.replaceAll('<br>', '\n')}
                </p>
                {user.id === post.creator ? <DeletePost postId={post.id} /> : null}
            </div>
        </PostCardToggle>
    )
}
