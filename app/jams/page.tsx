import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Jams`,
    description: "Find and host improv jams!",
};

export default function JamsPage() {
    return (
        <h1>Jams Page</h1>
    )
}