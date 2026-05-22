import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: `${appName} | Profile`,
    description: "Improv performer profiles",
};

export default async function ProfilePage() {
    const { user } = await verifyAuth();
    if (user?.id) {
        return redirect(`/profile/${user.id}`);
    } else {
        return redirect('/login');
    }
}