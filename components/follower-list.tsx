import { optimizeImage } from "@/lib/optimize-image";
import Image from "next/image";
import Link from "next/link";

export default async function FollowerList({ followers, caption = 'Followers', isTeam }: {
    followers: { name: string, id: string, image?: string }[],
    caption?: string,
    isTeam?: boolean
}) {
    return <>
        <h3 className="mt-3 font-semibold text-sm">{caption}</h3>
        <ul className="mt-2 flex flex-row flex-wrap min-h-36">
            {followers.map(({ id, name, image }, i) => (
                <li key={i} className="no-bullets w-1/3 min-w-[200px] mb-1">
                    <Link
                        className="link flex flex-row gap-2 items-center w-fit"
                        href={`/${isTeam ? 'teams' : 'profile'}/${id}`}
                    >
                        {image ? (
                            <Image
                                src={optimizeImage(image, 72, 72, 90, true, true)}
                                alt={name} width={36} height={36}
                            />
                        ) : null}
                        <p>{name}</p>
                    </Link>
                </li>
            ))}
        </ul>
    </>
}