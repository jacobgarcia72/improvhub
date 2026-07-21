import { requestPasswordReset } from "@/actions/auth-actions";
import Button from "@/components/form/button";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { appName } from "@/lib/app-info";
import { SearchParams } from "next/dist/server/request/search-params";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: `Reset Password | ${appName}`
};

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const params = await searchParams;
    const sent = params.sent === 'true';
    const invalidLink = params.error === 'invalid-link';

    return (
        <div className="w-full min-h-[calc(100vh-100px)] flex flex-col items-center justify-center">
            <section className="small-section">
                <div className="flex flex-col m-auto max-w-md pb-8 pt-4">
                    {sent && (
                        <div className="text-sm bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-300 py-2 px-4 rounded mb-3 border border-green-900">
                            If an account matches the provided email address, a password reset link is on its way.
                        </div>
                    )}
                    {invalidLink && (
                        <div className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 py-2 px-4 rounded mb-3 border border-red-800">
                            That password reset link is invalid or has expired. Request a new one below.
                        </div>
                    )}
                    <Form onSubmit={requestPasswordReset} buttonCaption="Send Reset Link">
                        <h1 className="text-slate-800 text-lg">
                            Reset Password
                        </h1>
                        <p className="text-sm text-slate-600">
                            Enter your email and we will send you a link to choose a new password.
                        </p>
                        <Input required name="email" type="email" label="Email" />
                    </Form>
                    <Link href="/login" className="m-auto">
                        <Button
                            caption="Back to Sign In"
                            style="link"
                        />
                    </Link>
                </div>
            </section>
        </div>
    );
}
