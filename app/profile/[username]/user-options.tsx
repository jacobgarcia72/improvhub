'use client';

import Button from "@/components/form/button";
import { User } from "@/types";
import { useState } from "react";
import Form from "@/components/form/form";
import { updateUserInfo } from "@/actions/auth-actions";
import UserDetails from "./user-details";
import Input from "@/components/form/input";
import ImagePicker from "@/components/form/image-picker";
import Autocomplete from "@/components/form/autocomplete";
import { pronouns } from "@/lib/demographics";
import Checkbox from "@/components/form/checkbox";
import { capitalize } from "@/lib/helper-functions";

export default function UserOptions({ user, userRoles }: {
    user: User,
    userRoles?: { [role: string]: boolean }
}) {
    const [makeChanges, setMakeChanges] = useState(false);
    const [updateImage, setUpdateImage] = useState(false);
    
    const handleSubmit = async (prevState: void | { message?: string }, formData: FormData) => {
        await updateUserInfo(prevState, formData, updateImage);
        setMakeChanges(false);
    }
    
    if (makeChanges) {
        return (
            <Form
                onSubmit={handleSubmit}
                buttonCaption="Save Changes"
                cancel={() => setMakeChanges(false)}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <ImagePicker
                        currentImage={user.image}
                        label="Profile Picture"
                        onChange={() => setUpdateImage(true)}
                        name="image"
                        square
                    />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Input value={user.firstName} label="First Name" name="firstName" maxLength={20} required />
                    <Input value={user.lastName} label="Last Name" name="lastName" maxLength={20} required />
                    <Autocomplete startingValue={user.pronouns || ''} options={pronouns} name="pronouns" maxLength={20} label="Pronouns" />
                </div>
                <div className="grid gap-4 sm:grid-cols-5">
                    {['player', 'tech', 'director', 'musician', 'coach'].map((role) => (
                        <Checkbox
                            key={role}
                            defaultChecked={userRoles?.[role] || false}
                            name={role}
                            label={capitalize(role)}
                        />
                    ))}
                </div>
            </Form>
        )
    }
    return (
        <div className="flex flex-col">
            <UserDetails user={user} />
            <div className="flex flex-row justify-center">
                <Button style="link"
                    caption="Edit User Details"
                    onClick={() => setMakeChanges(true)}
                />
            </div>
        </div>
    )
}