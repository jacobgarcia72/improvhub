'use client';

import Button from "@/components/form/button";
import { User } from "@/types";
import { useState } from "react";
import LocationInputs from "@/components/form/location-inputs";
import Form from "@/components/form/form";
import { updateUserCommunityOptions } from "@/actions";

export default function CommunityOptions({ user}: { user: User }) {
    const [makeChanges, setMakeChanges] = useState(false);
    if (makeChanges) {
        return (
            <Form
                onSubmit={updateUserCommunityOptions}
                buttonCaption="Save Changes"
                cancel={() => setMakeChanges(false)}
            >
                <LocationInputs
                    cityCaption="Nearest improv community:"
                    theatreCaption="What theatres are you involved with?"
                />
            </Form>
        )
    }
    return (
        <div className="flex flex-row justify-center">
            <Button style="link"
                caption={(
                    user.city || user.state || user.theatres?.length
                ) ? "Make Changes" :"Add City and Theatres"}
                onClick={() => setMakeChanges(true)}
            />
        </div>
    )
}