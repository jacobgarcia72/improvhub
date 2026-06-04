import { getShow, getShowCast, getShowing } from "@/lib/shows";
import { getCurrentUser } from "@/lib/users";
import { notFound } from "next/navigation";
import CastingTools from "./casting-tools";
import CastList from "@/components/cast-list";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { ShowCastMember } from "@/types";

export default async function ShowDatePage({ params } : {
    params: Promise<{ id: string, dateTime: string }>
    }) {
    const { id, dateTime } = await params;
    const showDate = dateTime.replace('%20', ' ').replace('%3A', ':');
    const showing = id ? await getShowing(id, showDate) : null;
    const parentShow = id ? await getShow(id) : null;
    if (!showing || !parentShow) notFound();

    const user = await getCurrentUser();
    const isAdmin = user && parentShow?.admins.includes(user.id);

    const showCast: ShowCastMember[] = await getShowCast(id, dateTime);
    const isDirector = Boolean(user && showCast.find((c) => c.id === user.id));

    return (
        <div className="flex flex-col pb-3">
            <div className="pt-1 px-6">
                <h3 className="font-semibold font-lg pb-2">{formatDateTimeForDisplay(showDate)}</h3>
                {(isAdmin || isDirector) ? (
                    <CastingTools id={id}
                        showDate={showDate}
                        buttonCaption={showCast.length ? 'Edit Cast' : 'Cast Show'}
                    />
                ) : null}
            </div>
            <CastList castMembers={showCast} noConfirm />
        </div>
    )
}