import { login } from "@/actions/auth-actions";
import Button from "@/components/form/button";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const reroute = (await searchParams)?.reroute || '';
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
                <div className="flex flex-col m-auto max-w-md pb-8 pt-4">
                    <Form onSubmit={login.bind(null, `/${reroute}`)}>
                        <h1 className="text-slate-800 text-lg">
                            {caption}
                        </h1>
                        <Input required name="username" label="Username" />
                        <Input required name="password" type="password" label="Password" />
                    </Form>
                    <Link href="signup" className="m-auto">
                        <Button
                            caption="Create Account"
                            style="link"
                        />
                    </Link>
                </div>
            </section>
        </div>
    )
}