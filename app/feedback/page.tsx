import ComingSoon from "@/components/coming-soon";
import { appName } from "@/lib/app-info";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: `Feedback | ${appName}`
};

export default function FeedbackPage() {
    return (
        <ComingSoon />
    );
}