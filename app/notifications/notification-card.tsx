import { optimizeImage } from "@/lib/optimize-image";
import { getFriendship, getUserAbbreviated } from "@/lib/users";
import { Notification } from "@/types";
import Image from "next/image";
import Link from "next/link";
import FriendRequestButtons from "./friend-request-buttons";

function Wrapper({ children, image, imageLink, imageAlt }: { children: React.ReactNode, image?: string | null, imageLink: string, imageAlt: string }) {
    return (
        <div className="border-b border-b-black/20 px-2 pb-3">
            <div className="flex flex-row gap-2 items-center">
                {image ? <Link href={imageLink}>
                    <Image
                        src={optimizeImage(image, 100, 100, 90, true)}
                        alt={imageAlt} width={50} height={50}
                        className="rounded"
                    />
                </Link> : null}
                {children}
            </div>
        </div>
    )
}

export default async function NotificationCard({ notification, userId }: { notification: Notification, userId: string }) {
    const { type, sender: senderId, id: notifId } = notification;
    const sender = await getUserAbbreviated(senderId);
    if (!sender) return null;
    switch (type) {
        case 'friend_request':
            let innerContent: React.ReactNode;
            const friendship = await getFriendship(userId, senderId);
            if (friendship === null) {
                return null;
            } else if (friendship?.accepted) {
                innerContent = (
                    <p>
                        You and&nbsp;
                        <Link href={`/profile/${senderId}`} className="link">
                            {sender.name}
                        </Link>
                        &nbsp;are now friends!
                    </p>
                )
            } else {
                innerContent = (
                    <div className="flex flex-col gap-1">
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender.name}
                            </Link>
                            &nbsp;sent you a friend request!
                        </p>
                        <FriendRequestButtons yourId={userId} thierId={senderId} notifId={notifId} />
                    </div>
                )
            }
            return (
                <Wrapper image={sender.image} imageLink={`/profile/${senderId}`} imageAlt={sender.name}>
                    {innerContent}
                </Wrapper>
            )
        case 'friend_request_accept':
            return (
                <Wrapper image={sender.image} imageLink={`/profile/${senderId}`} imageAlt={sender.name}>
                        <p>
                            <Link href={`/profile/${senderId}`} className="link">
                                {sender.name}
                            </Link>
                            &nbsp;accepted your friend request!
                        </p>
                </Wrapper>
            )
        default:
            break;
    }
    return null;
}
