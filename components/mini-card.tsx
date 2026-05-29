import { optimizeImage } from "@/lib/cloudinary";
import { removeLeadingArticles } from "@/lib/helper-functions";
import { theatres } from "@/lib/theatres";
import { Event, Team } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function MiniCard({ item, type }: { item: Event | Team, type: string }) {
    const image = (
        item.image && optimizeImage(item.image, 300, null, 80)
    ) || (
        'theatre' in item && (
            theatres.find((t) => removeLeadingArticles(t.name) === removeLeadingArticles(item.theatre || ''))
        )?.logo
    );
    const name = 'name' in item ? item.name : 'title' in item ? item.title : '';
    return (
        <Link href={`/${type}s/${item.id}`}>
            <div className="m-2 w-44 overflow-hidden rounded-3xl border border-slate-300 bg-slate-50/80 shadow-sm shadow-slate-800/10 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="h-20 w-full bg-gray-300">
                    <div className="flex h-full w-full items-center justify-center">
                        {image ? (
                            <Image src={image} alt={name} width={120} height={120} className="object-cover h-full w-full" />
                        ) : (
                            <div className="flex h-20 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                                No image available
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-5 pb-1 pt-1">
                    <h2 className="h-7 text-lg text-slate-900 overflow-hidden text-ellipsis">{name}</h2>
                    <div className="fade-out text-sm text-slate-900 overflow-hidden text-ellipsis flex flex-col gap-1 pt-1 h-28">
                        {item.description ? (
                            item.description.split('<br>').map((line, i) => <p key={i}>{line}</p>)
                        ) : <p>(No description available)</p>}
                    </div>
                </div>
            </div>
        </Link>
    )
}