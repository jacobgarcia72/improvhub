import { getShow, getShowCast, getShowing } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";
import CastingTools from "./casting-tools";
import CastList from "@/components/cast-list";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { ShowCastMember } from "@/types";
import Link from "next/link";

export default async function ShowDatePage({ params } : {
    params: Promise<{ id: string, dateTime: string }>
    }) {
    const { id, dateTime } = await params;
    const showDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const showing = id ? await getShowing(id, showDate) : null;
    const parentShow = id ? await getShow(id) : null;
    if (!showing || !parentShow) notFound();

    const userId = await getCurrentUserId();
    const isAdmin = userId && parentShow?.admins.includes(userId);

    const showCast: ShowCastMember[] = await getShowCast(id, dateTime);
    const isDirector = Boolean(userId && showCast.find((c) => c.id === userId));

    return (
        <div className="flex flex-col pb-3">
            <div className="pt-1 px-6">
                <div>
                    <h3 className="font-semibold font-lg pt-2 pb-0">{`Show Date: ${formatDateTimeForDisplay(showDate)}`}</h3>
                    <Link className="link pb-2 text-sm mt-[-4px]" href={`/shows/${id}`}>Go to parent show page</Link>
                </div>
                {(isAdmin || isDirector) ? (
                    <CastingTools id={id}
                        showDate={showDate}
                    />
                ) : null}
            </div>
            <CastList castMembers={showCast} noConfirm />
        </div>
    )
}