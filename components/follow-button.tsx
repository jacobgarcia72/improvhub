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
    mini
} : {
    userId: string;
    followId: string;
    type: Followee;
    following: boolean | null;
    mini?: boolean
}) {
    const [pending, setPending] = useState(false);
    return (
        <Button
            caption={following ? 'Following' : 'Follow'}
            className={`${following ? 'green ' : ''}${mini ? 'small ' : ''}w-28`}
            onClick={async () => {
                setPending(true);
                await setFollowing(userId, followId, type);
                setPending(false);
            }}
            disabled={pending}
        />
    )
}