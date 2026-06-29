import Button from "@/components/form/button";
import { UserLink } from "@/components/user-link";
import { getShow, getShowings } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShowDetails from "./show-details";
import DeleteShow from "./delete-show";
import ShowHeader from "./show-header";
import Showing from "./[dateTime]/showing";
import ShowDate from "./[dateTime]/show-date";

export default async function ShowDetailsPage({ params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    const show = await getShow(id);

    if (!show) notFound();

    const { admins } = show;
    const userId = await getCurrentUserId();
    const isAdmin = userId && admins.includes(userId);

    const showings = show.recurringTime ? null : await getShowings(id);
    const onlyOneShowing = showings?.length === 1;

    return <>
        <ShowHeader show={show}>{onlyOneShowing ? <ShowDate showDate={showings[0].dateTime} /> : <h3 className="font-semibold font-lg pt-2 pb-0">Show Series</h3>}</ShowHeader>
        {onlyOneShowing && <Showing id={id} dateTime={showings[0].dateTime} parentShow={show} isASeries={false} />}
        {isAdmin ? <div className="my-4">
            <div className="flex flex-row-reverse flex-wrap gap-2 justify-center">
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
            {!onlyOneShowing && (
                <div className="w-full flex justify-center">
                    <div className="flex justify-center px-3 py-3 border border-gray-700 bg-slate-200 rounded">
                        <p className="text-sm">
                            <span className="font-semibold">Admin Note:</span> This is a show series. To manage casting of individual showings, select a date below.
                        </p>
                    </div>
                </div>
            )}
        </div> : null}
        <ShowDetails show={show} />
        {isAdmin && <DeleteShow showId={show.id} showTitle={show.title} isASeries={!onlyOneShowing} />}
    </>
}