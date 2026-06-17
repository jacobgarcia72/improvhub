import Button from "@/components/form/button";
import { UserLink } from "@/components/user-link";
import { getShow } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShowDetails from "./show-details";
import DeleteShow from "./delete-show";
import ShowHeader from "./show-header";

export default async function ShowDetailsPage({ params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    const show = await getShow(id);

    if (!show) notFound();

    const { admins } = show;
    const userId = await getCurrentUserId();
    const isAdmin = userId && admins.includes(userId);

    return <>
        <ShowHeader show={show} />
        {isAdmin ? <>
            <div className="flex flex-row-reverse flex-wrap gap-2 justify-center my-4">
                <div>
                    <Link href={`/manage/show/${id}`}>
                        <Button caption="Manage Show Details" className="w-54" />
                    </Link>
                </div>
                <div>
                    <Link href={`/shows/${id}/admins`}>
                        <Button caption="Manage Admins" className="w-54" />
                    </Link>
                    <h3 className="mt-3 mb-1 font-semibold text-sm">Show Page Admins</h3>
                    {admins.map((admin, i) => (
                        <UserLink key={i} userId={admin} />
                    ))}
                </div>
            </div>
        </> : null}
        <ShowDetails show={show} />
        {isAdmin && <DeleteShow showId={show.id} showTitle={show.title} />}
    </>
}