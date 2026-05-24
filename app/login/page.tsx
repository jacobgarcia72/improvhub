import { login } from "@/actions/auth-actions";
import Button from "@/components/form/button";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { SearchParams } from "next/dist/server/request/search-params";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const reroute = (await searchParams)?.reroute || '';

    return (
        <section className="small-section">
            <div className="flex flex-col m-auto max-w-md pb-8 pt-4">
                <Form onSubmit={login.bind(null, `/${reroute}`)}>
                    <h1 className="text-slate-800 text-lg">
                        {reroute ? 'Sign in to use this feature' : 'Sign In'}
                    </h1>
                    <Input required name="username" label="Username" />
                    <Input required name="password" type="password" label="Password" />
                </Form>
                <Link href="signup" className="m-auto">
                    <Button
                        caption="Create Account"
                        type="button"
                        style="link"
                    />
                </Link>
            </div>
        </section>
    )
}