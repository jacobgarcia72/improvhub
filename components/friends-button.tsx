'use client'
import Button from "./form/button"
import { acceptFriendRequest, createFriendRequest, deleteFriendRequest, unfriend } from "@/lib/users"
import { useState } from "react";

export default function FriendsButton({
    yourId,
    theirId,
    youSentRequest,
    theySentRequest,
    friends,
    mini,
} : {
    yourId: string,
    theirId: string,
    youSentRequest: boolean,
    theySentRequest: boolean,
    friends: boolean,
    mini?: boolean
}) {
    const [pending, setPending] = useState(false);
    if (theySentRequest && !friends) {
        return (
            <div className="flex flex-col items-center">
                <p className="text-sm">Respond to Friend Request</p>
                <div className="flex flex-row gap-1">
                    <Button
                        caption='Accept'
                        className={`green small w-20`}
                        onClick={async () => {
                            setPending(true);
                            await acceptFriendRequest(theirId, yourId);
                            setPending(false);
                        }}
                        disabled={pending}
                    />
                    <Button
                        caption='Reject'
                        className={`red small w-20`}
                        onClick={async () => {
                            setPending(true);
                            await deleteFriendRequest(theirId, yourId);
                            setPending(false);
                        }}
                        disabled={pending}
                    />
                </div>
            </div>
        )
    }
    if (friends) {
        
    return <div className="flex flex-col items-center">
        <p className="font-semibold text-lg mb-1">Your Friend</p>
        <Button
            caption="Remove Friend"
            className={`small w-34`}
            onClick={async () => {
                setPending(true);
                await unfriend(yourId, theirId);
                setPending(false);
            }}
            disabled={pending}
        />
    </div>
    }
    return <div className="flex flex-col items-center">
        {youSentRequest ? (
            <p className="text-sm">Friend Request Sent</p>
        ) : null}
        <Button
            caption={youSentRequest ? 'Cancel Request' : 'Add Friend'}
            className={`${youSentRequest ? 'small w-36' : 'w-42'}${mini ? ' small ' : ''}`}
            onClick={async () => {
                setPending(true);
                if (youSentRequest) {
                    await deleteFriendRequest(yourId, theirId);
                } else {
                    await createFriendRequest(yourId, theirId);
                }
                setPending(false);
            }}
            disabled={pending}
        />
    </div>
}