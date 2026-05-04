'use client';
import SearchWithOptions from "@/components/form/search-with-options";
import { Theatre } from "@/types";
import Image from "next/image";
import { useState } from "react";

export default function TheatreSearch() {
    const [theatres, setTheatres] = useState<Theatre[]>([]);

    return (
        <>
            <SearchWithOptions onSearch={(results) => setTheatres(results)} />
            <section className="flex flex-col px-4 pb-4">
                {theatres.map((theatre, index) => (
                    <div key={index} className="border border-gray-300 rounded p-4 mb-4">
                        <Image src={theatre.logo || '/placeholder-logo.png'} alt={`${theatre.name} logo`} width={100} height={100} className="mb-2" />
                        <h2 className="text-xl font-bold">{theatre.name}</h2>
                    </div>
                ))}
            </section>
        </>
    )
}