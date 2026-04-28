import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Teams`,
    description: "Explore improv teams in your area!",
};

export default function TeamsPage() {
    return (
        <h1>Teams Page</h1>
    )
}