import { login } from "@/actions/auth-actions";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import Link from "next/link";

export default function LoginPage() {
    return (
        <section className="small-section">
            <div className="flex flex-col m-auto max-w-md pb-8 pt-4">
                <Form onSubmit={login}>
                    <h1 className="text-slate-800 text-lg">Login</h1>
                    <Input required name="username" label="Username" />
                    <Input required name="password" type="password" label="Password" />
                </Form>
                <Link
                    href="signup"
                    className="m-auto inline-block text-md font-medium text-blue-600 hover:text-blue-900 transition-colors"
                >
                    Create Account
                </Link>
            </div>
        </section>
    )
}