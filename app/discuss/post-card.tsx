import { getUser } from "@/lib/users";
import { DiscussionPost, User } from "@/types";
import UserImage from "./user-image";
import NewCommentForm from "./new-comment-form";
import { getComments } from "@/lib/chat";
import Link from "next/link";

export default async function PostCard({ post, user, room, topic }: { post: DiscussionPost, user: User, room: string, topic: string }) {
    const { post: body } = post;
    const poster = await getUser(post.creator);
    const comments = await getComments(room, topic, post.id);
    return (
        <div className="flex flex-row items-start w-full">
            {poster ? (
                <div className="mt-[2px]">
                    <UserImage user={poster} />
                </div>
            ) : null}
            <div className="flex flex-col w-full gap-1 pl-2">
                <div className="border border-slate-400 bg-slate-100/40 rounded py-2 px-4">
                    <p className="text-mist-900">{body.replaceAll('<br>', '\n')}</p>
                </div>
                {comments.map(async (c) => {
                    const commenter = await getUser(c.creator);
                    const name = commenter ? `${commenter.firstName} ${commenter.lastName}` : null;
                    return (
                        <div key={c.id} className="flex flex-row gap-1">
                            {commenter ? <UserImage small user={commenter} /> : null}
                            <p className="w-full border border-gray-300 rounded px-3 py-2 text-mist-600">
                                <span className="text-blue-500 text-[0.9em]">{commenter ? (
                                    <Link href={`/profile/${commenter.id}`}>{name}</Link>
                                ): '[deleted]'}:</span>&nbsp;{c.comment}
                            </p>
                        </div>
                    )
                })}
                <NewCommentForm user={user} room={room} topic={topic} postId={post.id} /> 
            </div>
        </div>
    )
}