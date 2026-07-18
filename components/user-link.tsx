import { optimizeImage } from "@/lib/optimize-image";
import { getUserAbbreviated } from "@/lib/users";
import Image from "next/image";
import Link from "next/link";

export async function UserLink({userId}: {userId: string}) {
    const user = await getUserAbbreviated(userId);
    if (!user) return null;
    return (
        <Link
            className="link flex flex-row gap-2 items-center w-fit"
            href={`/profile/${user.id}`}
        >
            {user.image ? (
                <Image
                    src={optimizeImage(user.image, 72, 72, 90, true, true)}
                    alt={user.name} width={36} height={36}
                    className="mb-[10px] rounded-full"
                />
            ) : null}
            <p className="mb-4 mt-2">{user.name}</p>
        </Link>
    )
}