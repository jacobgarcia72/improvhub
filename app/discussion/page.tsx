import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Discussion`,
    description: "Discuss improv topics with the community!",
};

export default function DiscussionPage() {
    return (
        <h1>Discussion Page</h1>
    )
}