'use client'
import { TheatreLink } from "@/components/theatre-link";
import { InputOption, Theatre, User } from "@/types";
import { useEffect, useState } from "react";

export default function CommunityDetails({ user }: { user: User }) {
    const [theatres, setTheatres] = useState<InputOption[]>([]);
    useEffect(() => {
        const fetchTheatres = async () => {
            if (!user.theatres?.length) return;
            const ts: InputOption[] = [];
            for (let i = 0; i < user.theatres.length; i++) {
                const t = user.theatres[i];
                const res = await fetch(`/api/theatre?idOrName=${t}`);
                if (!res.ok) return;
                const foundTheatre: Theatre | null = await res.json();
                const input: InputOption = foundTheatre ? ({ text: foundTheatre.name, id: foundTheatre.id, image: foundTheatre.image }) : t;
                ts.push(input);
            }
            setTheatres(ts);
        }
        fetchTheatres();
    }, [user.theatres]);
    return (
        <>
            {theatres.length ? (
                <div className="mt-2">
                    {theatres.map((theatre, i) => <TheatreLink theatre={theatre} key={i} />)}
                </div>
            ) : null}
            {user.city || user.state ? (
                <p className="mt-2">{`${user.city ? user.city + ', ' : ''}${user.state || ''}`}</p>
            ) : null}
        </>
    )
}