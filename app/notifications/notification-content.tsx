import { optimizeImage } from "@/lib/optimize-image";
import { getUserAbbreviated } from "@/lib/users";
import { Notification } from "@/types";
import Image from "next/image";
import Link from "next/link";
import FriendRequestButtons from "./friend-request-buttons";

async function UserImage({image, userName}: {image: string, userName: string}) {
    return (
        <Image
            src={optimizeImage(image, 100, 100, 90, true)}
            alt={userName} width={50} height={50}
            className="rounded"
        />
    )
}

export default async function NotificationContent({ notification, userId }: { notification: Notification, userId: string }) {
    const { type, sender: senderId, id: notifId } = notification;
    const sender = await getUserAbbreviated(senderId);
    if (!sender) return null;
    switch (type) {
        case 'friend_request':
            return <div className="flex flex-row gap-2 items-center">
                {sender.image ? <Link href={`/profile/${senderId}`}>
                    <UserImage image={sender.image} userName={sender.name} />
                </Link> : null}
                <div className="flex flex-col gap-1">
                    <p>
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender.name}
                        </Link>
                        &nbsp;sent you a friend request!
                    </p>
                    <FriendRequestButtons yourId={userId} thierId={senderId} notifId={notifId} />
                </div>
            </div>
        default:
            break;
    }
    return null;
}
