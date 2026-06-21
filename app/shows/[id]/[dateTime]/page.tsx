import { getRsvpCount, getRsvpStatus, getShow, getShowCast, getShowing } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";
import CastingTools from "./casting-tools";
import CastList from "@/components/cast-list";
import { ShowCastMember, Team } from "@/types";
import Link from "next/link";
import CastRoleBanner from "./cast-role-banner";
import { getTeamsByUser } from "@/lib/teams";
import CancelShowing from "./cancel-showing";
import RSVP from "./rsvp";
import ShowDetails from "../show-details";
import ShowHeader from "../show-header";
import ShowDate from "./show-date";
import { dateMatchesRecurringSchedule } from "@/lib/dates";
import AddToCalendarButton from "./add-to-calendar";
import { getTheatre } from "@/lib/theatres";

export default async function ShowDatePage({ params } : {
    params: Promise<{ id: string, dateTime: string }>
    }) {
    const { id, dateTime } = await params;

    const parentShow = id ? await getShow(id) : null;
    if (!parentShow) notFound();

    const showDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const showing = id ? await getShowing(id, showDate) : null;
    const { recurringDay, recurringTime, cadence } = parentShow;
    if (!(showing || (
        cadence && dateMatchesRecurringSchedule(showDate, recurringDay, cadence, recurringTime)
    ))) notFound();

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

    const rsvp = userId && !userRoles?.length ? await getRsvpStatus(userId, parentShow.id, showDate) : null;

    const goingCount = await getRsvpCount(parentShow.id, showDate, 'g');
    const interestedCount = await getRsvpCount(parentShow.id, showDate, 'i');

    let location = parentShow.theatre && (await getTheatre(parentShow.theatre))?.name || undefined;
    if (location && parentShow.city && parentShow.state) location += `, ${parentShow.city} ${parentShow.state}`;
    return <>
        <ShowHeader show={parentShow} />
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
            <div className="pt-1 pb-1 px-6">
                <div className="w-full flex flex-row items-center justify-between items-start">
                    <div className="mb-3">
                        <ShowDate showDate={showDate} />
                        <AddToCalendarButton show={parentShow} date={showDate} location={location} />
                        <Link className="link pb-2 text-sm mt-[-4px]" href={`/shows/${id}`}>Go to parent show page</Link>
                    </div>
                    <div className="flex flex-col items-end pt-1">
                        {userId && !userRoles?.length ? (
                            <RSVP
                                userId={userId}
                                showId={parentShow.id}
                                showDate={showDate}
                                rsvp={rsvp}
                            />
                        ) : null}
                        {goingCount > 0 && <p className="label mr-4">{`${goingCount} Going`}</p>}
                        {interestedCount > 0 && <p className="label mr-4">{`${interestedCount} Interested`}</p>}
                    </div>
                </div>
                {(isAdmin || isDirector) ? (
                    <CastingTools id={id}
                        showDate={showDate}
                    />
                ) : null}
            </div>
            <CastList castMembers={showCast} noConfirm />
            {isAdmin && <div className="w-full flex flex-row justify-center pt-6">
                <CancelShowing
                    showTitle={parentShow.title}
                    showId={id}
                    dateTime={dateTime}
                />
            </div>}
        </div>
        <ShowDetails show={parentShow} />
    </>
}