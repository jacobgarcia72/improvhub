'use client';

import Button from "@/components/form/button";
import { User } from "@/types";
import { useState } from "react";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { updateUserWebsite } from "@/actions/auth-actions";

export default function WebsiteOptions({ user }: { user: User }) {
    const [makeChanges, setMakeChanges] = useState(false);
    
    const handleSubmit = async (prevState: void | { message?: string }, formData: FormData) => {
        await updateUserWebsite(prevState, formData);
        setMakeChanges(false);
    }
    
    if (makeChanges) {
        return (
            <Form
                onSubmit={handleSubmit}
                buttonCaption="Save Changes"
                cancel={() => setMakeChanges(false)}
            >
                <Input value={user.website || ''} type="url" label="Website" name="website" maxLength={50} />
            </Form>
        )
    }
    return (
        <>
            {user.website && <a className="link" target="_blank" href={user.website}>{user.website}</a>}
            <div className="flex flex-row justify-center">
                <Button style="link"
                    caption={user.website ? 'Edit Website' : 'Add Website'}
                    onClick={() => setMakeChanges(true)}
                />
            </div>
        </>
    )
}