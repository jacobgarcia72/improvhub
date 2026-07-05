import { submitFeedback } from "@/actions";
import Form from "@/components/form/form";
import Text from "@/components/form/text";
import { appName } from "@/lib/app-info";
import { protectRoute } from "@/lib/auth";
import { Metadata } from "next";
import { SearchParams } from "next/dist/server/request/search-params";

export const metadata: Metadata = {
    title: `Feedback | ${appName}`
};

export default async function FeedbackPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    await protectRoute()
    const submittedFeedback = (await searchParams).success === 'true';
    return (
        <section className="medium-section">
            {submittedFeedback ? (
                <div className="bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300 py-2 px-4 rounded mb-3 border border-green-900">
                    Feedback submitted successfully! Thank you!
                </div>
            ) : <>
                <h1 className="text-lg mb-1">Submit Feedback</h1>
                <div className="text-sm text-gray-700 dark:text-gray-400 mb-4">
                    <p>Your feedback helps improve the site!</p>
                    <p>Report a bug, suggest a new feature, or let me know what can be improved!</p>
                </div>
                <Form onSubmit={submitFeedback}>
                    <Text name="feedback" rows={5} />
                </Form>
            </>}
        </section>
    );
}