import { optimizeImage } from "@/lib/optimize-image";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function UserImage({ user, linkProfile = true, small }: { user: User, linkProfile?: boolean, small?: boolean }) {
    const name = `${user.firstName} ${user.lastName[0]}.`;
    const content = <div className={`flex flex-col items-center`}>
        {user.image ? (
            <div className={small ? 'mt-1' : ''}>
                <Image className="rounded-full" src={optimizeImage(user.image, 50, 50, 90, true, true)} alt={name} width={small ? 36 : 40} height={small ? 36 : 40} />
            </div>
        ) : null}
    </div>
    return linkProfile ? (
        <Link href={`/profile/${user.id}`}>
            {content}
        </Link>
    ) : content
}