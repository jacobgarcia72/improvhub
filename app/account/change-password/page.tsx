import { updateUserPassword } from "@/actions/auth-actions";
import Form from "@/components/form/form";
import Input from "@/components/form/input";
import { getCurrentUser } from "@/lib/users";
import { redirect } from "next/navigation";

export default async function AccountPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    return (
        <section className="flex flex-col small-section">
            <Form onSubmit={updateUserPassword} cancel={async () => {
                'use server';
                redirect('/account');
            }}>
                <h1 className="text-2xl font-semibold mb-1">Change Password</h1>
                <Input name="currentPassword" label="Current Password" type="password" required />
                <Input name="newPassword" label="New Password" type="password" required />
                <Input name="confirmNewPassword" label="Confirm New Password" type="password" required />
            </Form>
        </section>
    )
}