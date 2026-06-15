import Button from "@/components/form/button";
import { UserLink } from "@/components/user-link";
import { getShow } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ShowDetailsPage({ params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    const show = await getShow(id);

    if (!show) notFound();

    const { admins } = show;
    const userId = await getCurrentUserId();
    const isAdmin = userId && admins.includes(userId);

    return isAdmin ? (
        <div className="mb-4">
            <h3 className="mt-3 mb-1 font-semibold text-sm">Show Page Admins</h3>
            {admins.map((admin, i) => (
                <UserLink key={i} userId={admin} />
            ))}
            <Link href={`/shows/${id}/admins`}>
                <Button caption="Manage Admins" />
            </Link>
        </div>
    ) : null;
}