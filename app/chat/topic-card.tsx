import { Topic } from "@/types";
import Link from "next/link";

export default function TopicCard({ topic }: { topic: Topic }) {
    const { title, description, room, id } = topic;
    return (
        <Link href={`/chat?room=${room}&topic=${id}`}>
            <div className="max-h-[72px] cursor-pointer border border-slate-400 transition-all bg-slate-100/40 hover:bg-slate-200 rounded py-2 px-4">
                <h3 className="font-semibold text-[1.05em] text-mist-700">{title}</h3>
                {description ? <p className="text-sm text-mist-800">{description.replaceAll('<br>', '\n')}</p> : null}
            </div>
        </Link>
    )
}