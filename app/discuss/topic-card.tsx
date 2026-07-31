import { getActivityTotal } from "@/lib/chat";
import { Topic } from "@/types";
import Link from "next/link";
import CommentCount from "./comment-count";

export default async function TopicCard({ topic, isHeader = false, children }: { topic: Topic, isHeader?: boolean, children?: React.ReactNode }) {
    const { title, description, room, id } = topic;
    const activityTotal = isHeader ? 0 : await getActivityTotal(room, topic.id);
    const content = (
        <div className={isHeader ? 'overflow-y-auto max-h-[120px] px-2 pb-1' : 'overflow-hidden cursor-pointer bg-slate-100/40 hover:bg-slate-200 dark:bg-black/50 dark:hover:bg-slate-900 max-h-[100px] border border-slate-400 dark:border-black transition-all rounded py-2 px-4'}>
            <div className="flex flex-row flex-wrap-reverse">
                <div className="grow-1 min-w-72">
                    <h3 className="font-medium text-mist-800 dark:text-white/80">{title}</h3>
                </div>
                {children}
                {isHeader ? null : (
                    <CommentCount count={activityTotal} />
                )}
            </div>
            {description ? <p className="max-h-16 fade-out text-[0.85em] text-mist-800 dark:text-white/90">{description.replaceAll('<br>', '\n')}</p> : null}
        </div>
    )
    return isHeader ? (
        <div className="mb-2">
            {content}
        </div>
    ) : (
        <Link href={`/discuss?channel=${room}&topic=${id}`}>
            {content}
        </Link>
    )
}