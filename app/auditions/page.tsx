import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Auditions`,
    description: "Find and post improv auditions!",
};

export default function AuditionsPage() {
    return (
        <h1>Auditions Page</h1>
    )
}