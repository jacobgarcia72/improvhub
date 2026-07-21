import { Topic } from "@/types";
import Link from "next/link";

export default function TopicCard({ topic, isHeader = false, backUrl }: { topic: Topic, isHeader?: boolean, backUrl?: string }) {
    const { title, description, room, id } = topic;
    const content = (
        <div className={`${isHeader ? 'bg-slate-100/80 dark:bg-black/50' : 'cursor-pointer bg-slate-100/40 hover:bg-slate-200 dark:bg-black/50 dark:hover:bg-slate-900'} max-h-[120px] border border-slate-400 dark:border-black transition-all rounded py-2 px-4`}>
            <div className="flex flex-row flex-wrap-reverse">
                <div className="grow-1 min-w-72">
                    <h3 className="font-semibold text-[1.05em] text-mist-700 dark:text-white/80">{title}</h3>
                </div>
                {backUrl ? (
                    <Link href={backUrl} className='link text-sm'>Back</Link>
                ) : null}
            </div>
            {description ? <p className="text-sm text-mist-800 dark:text-white/90">{description.replaceAll('<br>', '\n')}</p> : null}
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