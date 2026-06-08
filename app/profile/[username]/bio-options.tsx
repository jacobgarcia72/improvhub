'use client';

import Button from "@/components/form/button";
import { User } from "@/types";
import { useState } from "react";
import Form from "@/components/form/form";
import Text from "@/components/form/text";
import { updateUserBio } from "@/actions/auth-actions";

export default function BioOptions({ user }: { user: User }) {
    const [makeChanges, setMakeChanges] = useState(false);
    
    const handleSubmit = async (prevState: void | { message?: string }, formData: FormData) => {
        await updateUserBio(prevState, formData);
        setMakeChanges(false);
    }
    
    if (makeChanges) {
        return (
            <Form
                onSubmit={handleSubmit}
                buttonCaption="Save Changes"
                cancel={() => setMakeChanges(false)}
            >
                <Text label="Bio" name="bio" value={user.bio?.replaceAll('<br>', '\n') || ''} />
            </Form>
        )
    }
    return (
        <>
            {user.bio && user.bio.split('<br>').map((line, i) => <p key={i} className="min-h-3">{line || '  '}</p>)}
            <div className="flex flex-row justify-center">
                <Button style="link"
                    caption={user.bio ? 'Edit Bio' : 'Add Bio'}
                    onClick={() => setMakeChanges(true)}
                />
            </div>
        </>
    )
}