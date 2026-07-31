import { optimizeImage } from "@/lib/optimize-image";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function UserImage({ user, linkProfile = true, square, small, xsmall }: { user: User, linkProfile?: boolean, square?: boolean, small?: boolean, xsmall?: boolean }) {
    const name = `${user.firstName} ${user.lastName[0]}.`;
    const content = <div className={`flex flex-col items-center`}>
        {user.image ? (
            <div className={(small || xsmall) ? 'mt-1' : ''}>
                <Image className={square ? 'rounded' : "rounded-full"} src={optimizeImage(user.image, 50, 50, 90, true, !square)} alt={name} width={xsmall ? 30 : small ? 36 : 48} height={xsmall ? 30 : small ? 36 : 48} />
            </div>
        ) : null}
    </div>
    return linkProfile ? (
        <Link href={`/profile/${user.id}`}>
            {content}
        </Link>
    ) : content
}