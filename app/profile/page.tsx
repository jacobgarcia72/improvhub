import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const { user } = await verifyAuth();
    if (user?.id) {
        return redirect(`/profile/${user.id}`);
    } else {
        return redirect('/login');
    }
}