import { optimizeImage } from "@/lib/cloudinary";
import { Team } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function TeamCard({ team }: { team: Team }) {
    const image = (
        team.image && optimizeImage(team.image, 300, null, 80)
    ) || null;
    return (
        <Link href={`teams/${team.id}`}>
            <div className="m-2 w-64 overflow-hidden rounded-3xl border border-slate-300 bg-slate-50/80 shadow-sm shadow-slate-800/10 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="h-30 w-full bg-gray-300">
                    <div className="flex h-full w-full items-center justify-center">
                        {image ? (
                            <Image src={image} alt={team.name} width={120} height={120} className="object-cover h-full w-full" />
                        ) : (
                            <div className="h-24">
                            </div>
                        )}
                    </div>
                </div>
                <div className="px-5 pb-1 pt-1">
                    <h2 className="h-7 text-lg text-slate-900 overflow-hidden text-ellipsis">{team.name}</h2>
                    <p className="h-6 text-sm text-slate-500">{team.city}, {team.state}</p>
                    <div className="fade-out text-sm text-slate-900 overflow-hidden text-ellipsis flex flex-wrap gap-2 pt-1 h-28">
                        {team.description || '(No description available)'}
                    </div>
                </div>
            </div>
        </Link>
    )
}