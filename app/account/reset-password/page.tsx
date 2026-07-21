import { resetForgottenPassword } from "@/actions/auth-actions";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { appName } from "@/lib/app-info";
import { createSupabaseServerClient } from "@/lib/supabase-ssr";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: `Set New Password | ${appName}`
};

export default async function ResetPasswordPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login/forgot-password');
    }

    return (
        <section className="flex flex-col small-section">
            <Form onSubmit={resetForgottenPassword} buttonCaption="Update Password">
                <h1 className="text-lg">Select New Password</h1>
                <Input name="newPassword" label="New Password" type="password" required />
                <Input name="confirmNewPassword" label="Confirm New Password" type="password" required />
            </Form>
        </section>
    );
}
