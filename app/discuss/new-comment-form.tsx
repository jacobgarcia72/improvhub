'use client'
import { postComment } from "@/actions/chat-actions";
import Form from "@/components/form/form";
import Text from "@/components/form/text";
import { useState } from "react";
import UserImage from "./user-image";
import { User } from "@/types";
import { getRandomNumberString } from "@/lib/helper-functions";

export default function NewCommentForm({ user, room, topic, postId }: { user: User, room: string, topic: string, postId: string }) {
    const [active, setActive] = useState(false);
    const [id] = useState(`comment-${getRandomNumberString(10)}`);

    const handleSubmit = async (prevState: void | { message?: string }, formData: FormData) => {
        await postComment(user.id, room, topic, postId, prevState, formData);
        setActive(false);
    }


    return (
        <div id={id} className="flex flex-row items-start justify-stretch w-full border-b border-b-mist-300 mb-4 gap-1">
            <UserImage user={user} linkProfile={false} small />
            {active ? <>
                <Form smallButtons buttonCaption="Comment" className="gap-1 w-full" onSubmit={handleSubmit} cancel={() => {
                    setActive(false)
                }}>
                    <Text name="comment" rows={3} />
                </Form>
            </> : (
                <div
                    onClick={() => {
                        setActive(true);
                        setTimeout(() => {
                            document.querySelector<HTMLTextAreaElement>(`#${id} #comment`)?.focus();
                        }, 0);
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-mist-600 cursor-pointer"
                >
                    <p>Comment...</p>
                </div>
            )}
        </div>
    )
}