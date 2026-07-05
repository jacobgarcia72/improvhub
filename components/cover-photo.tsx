"use client"

import { optimizeImage } from "@/lib/optimize-image";
import Image from "next/image";
import { useState } from "react";

export default function CoverPhoto({ src, alt, photoCredit }: {src: string, alt: string, photoCredit?: string | null}) {
    const [fullscreen, setFullscreen] = useState(false);
    return <>
        {fullscreen ? <div className="z-100 fixed w-full h-full top-0 left-0 bg-black/95">
            <Image src={src}
                onClick={() => setFullscreen(false)}
                alt={alt}
                width={600}
                height={400}
                className="cursor-pointer w-full h-full object-contain"
            />
        </div> : null}
        <div className="flex flex-col items-center content-center">
            <Image src={optimizeImage(src, 1000, null, 90)}
                onClick={() => setFullscreen(true)}
                alt={alt}
                width={600}
                height={400}
                className="cursor-pointer mt-2 w-9/10 h-36 h-[40vw] max-h-64 object-cover rounded"
            />
            {photoCredit && <p className="italic text-sm">{`Photo Credit: ${photoCredit}`}</p>}
        </div>
    </>
}