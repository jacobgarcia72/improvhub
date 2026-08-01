import { getActivityTotal, getLatestPost } from "@/lib/chat";
import { Topic } from "@/types";
import Link from "next/link";
import CommentCount from "./comment-count";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { getUserName } from "@/lib/users";

export default async function TopicCard({ topic, isHeader = false, children }: { topic: Topic, isHeader?: boolean, children?: React.ReactNode }) {
    const { title, description, room, id } = topic;
    const activityTotal = isHeader ? null : await getActivityTotal(room, topic.id);
    const latestPost = isHeader ? null : await getLatestPost(room, topic.id);
    const content = (
        <div className={isHeader ? 'max-h-[120px] px-2 pb-1' : 'overflow-hidden cursor-pointer bg-slate-100/40 hover:bg-slate-200 dark:bg-black/50 dark:hover:bg-slate-900 border border-slate-400 dark:border-black transition-all rounded py-2 px-4'}>
            <div className="flex flex-row flex-wrap-reverse">
                <div className="grow-1">
                    <h3 className="font-medium text-mist-800 dark:text-white/80">{title}</h3>
                </div>
                {children}
                {isHeader ? null : (
                    <CommentCount count={activityTotal || 0} />
                )}
            </div>
            {isHeader ? (
                description ? <p className="mt-0.5 pb-1 mb-1 border-b border-b-gray-500/20 max-h-30 overflow-y-auto leading-snug text-[0.85em] text-mist-800 dark:text-mist-300/90">{description.replaceAll('<br>', '\n')}</p> : null
            ) : (
                <div className="flex flex-col gap-2">
                    {description ? <p className="max-h-12 overflow-hidden leading-tight text-[0.75em] text-mist-800 dark:text-mist-300/90">{`${description.replaceAll('<br>', '\n').substring(0, 200)}${description.length > 200 ? '...' : ''}`}</p> : null}
                    {latestPost ? <div className="max-h-12 overflow-hidden text-[0.75em] text-mist-600 dark:text-mist-400">
                        <p className="leading-none">
                            Latest Post: {formatDateTimeForDisplay(latestPost.date)}
                        </p>
                        <p>
                            {`${await getUserName(latestPost.creator)}: ${latestPost.post.replaceAll('<br>', '\n').substring(0, 200)}${latestPost.post.length > 200 ? '...' : ''}`}
                        </p>
                    </div> : null}
                </div>
            )}
        </div>
    )
    return isHeader ? (
        <div className="mb-3">
            {content}
        </div>
    ) : (
        <Link href={`/discuss?channel=${room}&topic=${id}`}>
            {content}
        </Link>
    )
}