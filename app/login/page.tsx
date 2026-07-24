import { login } from "@/actions/auth-actions";
import Button from "@/components/form/button";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { getCurrentUserId, getNumberOfTestUsers } from "@/lib/users";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { appName, isDevOrStaging } from "@/lib/app-info";
import TestUserButton from "./test-user-button";
import TestInputs from "./test-inputs";
import { generateDummyTroupes, generateDummyUsers } from "@/lib/dev-helpers";

export const metadata: Metadata = {
    title: `Login | ${appName}`
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const userId = await getCurrentUserId();
    if (userId) {
        redirect(`/profile/${userId}`);
    }
    const reroute = (await searchParams)?.reroute || '';

    const test = isDevOrStaging && (await searchParams)?.test === 'true';
    if (test) {
        const testUsersExist = await getNumberOfTestUsers() > 0;
        if (!testUsersExist) {
            await generateDummyUsers(100);
            await generateDummyTroupes(10);
        }
    }

    let caption = 'Sign In';
    if (reroute) {
        caption = reroute.includes('profile/') ? (
            'Sign in to view this profile'
        ) : (
            'Sign in to use this feature'
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-100px)] flex flex-col items-center justify-center">
            <section className="small-section">
                <div className="flex flex-col m-auto max-w-md pb-6 pt-4">
                    <Form onSubmit={login.bind(null, `/${reroute}`)}>
                        <h1 className="text-slate-800 text-lg">
                            {caption}
                        </h1>
                        {test ? (
                            <TestInputs />
                        ) : <>
                            <Input required name="email" type="email" label="Email" />
                            <Input required name="password" type="password" label="Password" />
                            <Link href="/login/forgot-password" className="link text-sm self-end -my-2">
                                Forgot password?
                            </Link>
                        </>}
                    </Form>
                    <Link href="signup" className="m-auto">
                        <Button
                            caption="Create Account"
                            style="link"
                        />
                    </Link>
                    {isDevOrStaging && <TestUserButton />}
                </div>
            </section>
        </div>
    )
}
