import { optimizeImage } from "@/lib/optimize-image";
import { User } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function UserImage({ user, useSecondPerson = false }: { user: User, useSecondPerson?: boolean }) {
    const name = `${user.firstName} ${user.lastName[0]}.`;
    const content = <div className="w-18 flex flex-col items-center">
        {user.image ? (
            <Image className="rounded-full" src={optimizeImage(user.image, 50, 50, 90, true, true)} alt={name} width={44} height={44} />
        ) : null}
        <p className="text-center text-xs text-mist-700 leading-3.5">{useSecondPerson ? 'You' : name}</p>
    </div>
    return useSecondPerson ? content : (
        <Link href={`/profile/${user.id}`}>
            {content}
        </Link>
    )
}