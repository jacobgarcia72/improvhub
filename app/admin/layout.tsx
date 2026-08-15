import { isSiteAdmin } from "@/lib/admins";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";

export default async function AdminLayout({ children }: {
    children: React.ReactNode
}) {
    const userId = await getCurrentUserId();
    if (!await isSiteAdmin(userId)) notFound();

    return (
        <section>
            <h1 className="mb-3 text-2xl">Admin</h1>
            {children}
        </section>
    )
}
