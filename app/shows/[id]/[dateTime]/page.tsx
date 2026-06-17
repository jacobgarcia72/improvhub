import { getShow, getShowCast, getShowing } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";
import CastingTools from "./casting-tools";
import CastList from "@/components/cast-list";
import { formatDateTimeForDisplay } from "@/lib/dates";
import { ShowCastMember, Team } from "@/types";
import Link from "next/link";
import CastRoleBanner from "./cast-role-banner";
import { getTeamsByUser } from "@/lib/teams";
import CancelShowing from "./cancel-showing";
import ShowDetails from "../show-details";

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
    const userRoles = userId ? (
        showCast.filter((c) => c.id === userId).map((c) => c.role)
    ) : null;
    let userTeams: Team[] = [];
    if (userId) {
        const teams = await getTeamsByUser(userId);
        const teamIds = teams.map((team) => team.id);
        userTeams = showCast.filter((c) => c.id && c.role === 'team' && teamIds.includes(c.id)).map((c) => teams.find((t) => t.id === c.id)).filter((t) => t !== undefined);
    }
    const isDirector = userRoles?.includes('director');

    return <>
        <div className="flex flex-col pb-3 border-b border-gray-400 mb-2">
            {userRoles?.length ? userRoles.map((role) => (
                <CastRoleBanner
                    showTitle={parentShow.title}
                    roleId={userId}
                    showId={id}
                    dateTime={dateTime}
                    role={role}
                    key={role}
                />
            )) : null}
            {userTeams?.length ? userTeams.map((team) => (
                <CastRoleBanner
                    teamName={team.name}
                    showTitle={parentShow.title}
                    roleId={team.id}
                    showId={id}
                    dateTime={dateTime}
                    role='team'
                    key={team.id}
                />
            )) : null}
            <div className="pt-1 px-6">
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="mb-3">
                        <h3 className="font-semibold font-lg pt-2 pb-0">{`Show Date: ${formatDateTimeForDisplay(showDate)}`}</h3>
                        <Link className="link pb-2 text-sm mt-[-4px]" href={`/shows/${id}`}>Go to parent show page</Link>
                    </div>
                    {isAdmin && (
                        <CancelShowing
                            showTitle={parentShow.title}
                            showId={id}
                            dateTime={dateTime}
                        />
                    )}
                </div>
                {(isAdmin || isDirector) ? (
                    <CastingTools id={id}
                        showDate={showDate}
                    />
                ) : null}
            </div>
            <CastList castMembers={showCast} noConfirm />
        </div>
        <ShowDetails show={parentShow} />
    </>
}