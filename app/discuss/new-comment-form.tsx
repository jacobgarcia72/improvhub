'use client'
import { postComment } from "@/actions/chat-actions";
import Form from "@/components/form/form";
import Text from "@/components/form/text";
import { useId, useState } from "react";
import UserImage from "./user-image";
import { User } from "@/types";

export default function NewCommentForm({ user, room, topic, postId }: { user: User, room: string, topic: string, postId: string }) {
    const [active, setActive] = useState(false);
    const id = useId();

    const handleSubmit = async (prevState: void | { message?: string }, formData: FormData) => {
        await postComment(user.id, room, topic, postId, prevState, formData);
        setActive(false);
    }

    const focusCommentInput = () => {
        setActive(true);
        setTimeout(() => {
            document.getElementById(id)?.querySelector<HTMLTextAreaElement>("#comment")?.focus();
        }, 0);
    }

    return (
        <div id={id} className="pl-2 pr-6 flex flex-row items-start justify-stretch w-full gap-1.5">
            <UserImage user={user} linkProfile={false} xsmall />
            {active ? <>
                <Form smallButtons buttonCaption="Comment" className="gap-1 w-full" onSubmit={handleSubmit} cancel={() => {
                    setActive(false)
                }}>
                    <Text name="comment" rows={3} />
                </Form>
            </> : (
                <div
                    onClick={focusCommentInput}
                    className="w-full border dark:bg-black dark:text-mist-300 border-gray-300 rounded px-3 py-2 mb-3 text-mist-600 cursor-pointer"
                >
                    <p>Comment...</p>
                </div>
            )}
        </div>
    )
}
