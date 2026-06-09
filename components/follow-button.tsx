'use client'
import { Followee } from "@/types"
import Button from "./form/button"
import { setFollowing } from "@/lib/users"
import { useState } from "react";

export default function FollowButton({
    userId,
    followId,
    type,
    following,
    mini,
    caption
} : {
    userId: string;
    followId: string;
    type: Followee;
    following: boolean | null;
    mini?: boolean;
    caption? :string | null;
}) {
    const [pending, setPending] = useState(false);
    const [showFollowing, setShowFollowing] = useState(following);
    return (
        <Button
            caption={caption || (showFollowing ? 'Following' : 'Follow')}
            className={`${showFollowing ? 'green ' : ''}${mini ? 'small ' : ''}w-28`}
            onClick={async () => {
                setShowFollowing(!following)
                setPending(true);
                await setFollowing(userId, followId, type, !following);
                setPending(false);
            }}
            disabled={pending}
        />
    )
}