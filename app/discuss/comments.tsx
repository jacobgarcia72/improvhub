import NewCommentForm from "./new-comment-form";
import { Comment, User, DiscussionPost } from "@/types";
import UserImage from "./user-image";
import Link from "next/link";
import DeletePost from "./delete-post";
import { getUser } from "@/lib/users";

export default async function Comments({ comments, post, user }: {
    comments: Comment[],
    post: DiscussionPost,
    user: User
}) {
    return <>
        <div className="mb-0.5 pl-6 pr-2">
            {comments.map(async (c) => {
                const commenter = await getUser(c.creator);
                const name = commenter ? `${commenter.firstName} ${commenter.lastName[0]}` : null;
                return (
                    <div key={c.id} className="flex flex-row gap-1 mb-[6px] mt-[2px]">
                        {commenter ? <UserImage xsmall user={commenter} /> : null}
                        <div className="flex flex-row w-full">
                            <p className="grow-1 w-full">
                                <span className="text-blue-500 text-[0.9em]">{commenter ? (
                                    <Link href={`/profile/${commenter.id}`}>{name}</Link>
                                ): '[deleted]'}:</span>&nbsp;{c.comment}
                            </p>
                            {user.id === c.creator ? <DeletePost postId={post.id} commentId={c.id} /> : null}
                        </div>
                    </div>
                )
            })}
        </div>
        <NewCommentForm user={user} room={post.room} topic={post.topicId} postId={post.id} /> 
    </>
}
