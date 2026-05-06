import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import CreateProfileForm from './create-profile';


export const metadata: Metadata = {
    title: `${appName} | Profile`,
    description: "Improv performer profiles",
};

export default function ProfilePage() {
    return (
        <CreateProfileForm />
    )
}