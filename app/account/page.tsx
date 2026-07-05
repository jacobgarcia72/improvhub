import { getCurrentUser } from "@/lib/users";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteAccount from "../profile/[username]/delete-account";
import Button from "@/components/form/button";
import { logout } from "@/actions/auth-actions";
import { SearchParams } from "next/dist/server/request/search-params";

export default async function AccountPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const user = await getCurrentUser();
    if (!user) {
        redirect('/login');
    }
    const updatedPassword = (await searchParams).passwordChanged === 'true';
    return (
        <section className="small-section">
            {updatedPassword && <div className="bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-300 py-2 px-4 rounded mb-3 border border-green-900">
                Password updated successfully
            </div>}
            <div className="flex flex-col mx-4">
                <h1 className="text-2xl font-semibold mb-1">Account Settings</h1>
                <Link href={`/profile/${user.id}`} className="link mb-2 text-sm">Back to Profile</Link>
                <div className="flex flex-col gap-2 mb-5 mt-3 items-center">
                    <Link href="/account/change-password" className="link">
                        <Button caption="Change Password" style="link" />
                    </Link>
                    <Button
                        caption="Sign Out"
                        onClick={logout}
                        style="link"
                    />
                    <DeleteAccount user={user} />
                </div>
            </div>
        </section>
    )
}