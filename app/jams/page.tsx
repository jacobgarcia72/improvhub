import ComingSoon from "@/components/coming-soon";
import { Metadata } from "next";
import { appName } from "@/lib/app-info";

export const metadata: Metadata = {
    title: `Improv Jams | ${appName}`,
};

export default function MessagesPage() {
    return (
        <ComingSoon />
    )
}