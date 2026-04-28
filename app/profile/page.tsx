import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Profile`,
    description: "Improv performer profiles",
};

export default function ProfilePage() {
    return (
        <h1>Profile Page</h1>
    )
}