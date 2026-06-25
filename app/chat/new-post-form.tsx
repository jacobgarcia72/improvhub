'use client'
import { postNewPost } from "@/actions/chat-actions";
import Form from "@/components/form/form";
import Text from "@/components/form/text";
import { useState } from "react";
import UserImage from "./user-image";
import { User } from "@/types";

export default function NewPostForm({ user, room, topic }: { user: User, room: string, topic: string }) {
    const [active, setActive] = useState(false);
    return (
        <div className="flex flex-row items-start justify-stretch w-full border-b border-b-mist-200 mb-4">
            {active ? <>
                <UserImage user={user} useSecondPerson />
                <Form buttonCaption="Post" className="gap-1 w-full" onSubmit={postNewPost.bind(null, user.id, room, topic)} cancel={() => {
                    setActive(false)
                }}>
                    <Text name="post" rows={4} />
                </Form>
            </> : (
                <div
                    onClick={() => setActive(true)}
                    className="w-full border border-gray-300 rounded px-3 py-2 mb-3 text-mist-600 cursor-pointer"
                >
                    <p>Write something...</p>
                </div>
            )}
        </div>
    )
}