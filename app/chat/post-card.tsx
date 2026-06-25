import { getUser } from "@/lib/users";
import { DiscussionPost } from "@/types";
import UserImage from "./user-image";

export default async function PostCard({ post }: { post: DiscussionPost }) {
    const { post: body } = post;
    const user = post.creator ? await getUser(post.creator) : null;
    return (
        <div className="flex flex-row items-start">
            {user ? <UserImage user={user} /> : null}
            <div className="border border-slate-400 bg-slate-100/40 rounded py-2 px-4">
                <p className="text-mist-900">{body.replaceAll('<br>', '\n')}</p>
            </div>
        </div>
    )
}