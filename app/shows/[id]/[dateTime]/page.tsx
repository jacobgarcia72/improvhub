import { getShow, getShowing } from "@/lib/shows";
import { getCurrentUser } from "@/lib/users";
import { notFound } from "next/navigation";
import CastingTools from "./casting-tools";
import CastList from "@/components/cast-list";
import { formatDateTimeForDisplay } from "@/lib/dates";

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
    return (
        <div className="flex flex-col px-3 pb-3">
            <h3 className="font-semibold font-lg pb-2">{formatDateTimeForDisplay(showDate)}</h3>
            {isAdmin ? <CastingTools id={id} showDate={showDate} /> : <CastList castMembers={[]} />}
        </div>
    )
}