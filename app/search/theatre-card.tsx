import { Theatre } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function TheatreCard({ theatre }: { theatre: Theatre }) {
    return (
        <div className="w-60 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50/80 shadow-sm shadow-slate-300/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="h-36 w-full bg-gray-300">
                <div className="flex h-full w-full items-center justify-center">
                    {theatre.image ? (
                        <Image src={theatre.image} alt={theatre.name} width={120} height={120} className="h-24 w-auto object-contain" />
                    ) : (
                        <div className="flex h-24 w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                            No image available
                        </div>
                    )}
                </div>
            </div>
            <div className="px-5 pb-5 pt-3">
                <h2 className="text-lg font-semibold text-slate-900">{theatre.name}</h2>
                <p className="text-sm text-slate-500">{`${theatre.city}, ${theatre.state} ${theatre.zipcode}`}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                    <a
                        href={theatre.website}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                    >
                        Website
                    </a>
                    <Link
                        href={`/search?for=shows&theatre=${theatre.name.toLowerCase().split(" ").join("+")}`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        Shows
                    </Link>
                </div>
            </div>
        </div>
    )
}