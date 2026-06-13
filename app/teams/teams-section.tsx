import MiniCard from "@/components/mini-card";
import { getTeam } from "@/lib/teams";
import { Role, TeamMember } from "@/types";

export default async function TeamsSection({
    roles, header, teamMemberships
} : {
    roles: Role[],
    header: string,
    teamMemberships: TeamMember[]
}) {
    const membershipsByRoles = teamMemberships.filter(
        (m) => roles.includes(m.role as Role) && m.confirmed
    );
    const uniqueTeams = [...new Map(membershipsByRoles.map((m) => [m.team, m])).values()];
    const teams = (await Promise.all(
        uniqueTeams.map((m) => getTeam(m.team))
    )).filter((team) => team !== null)

    if (!teams?.length) return null;
    return (
        <section>
            <h2 className="px-3 font-semibold">{header}</h2>
            <div className="flex flex-row flex-wrap">
                {teams.map((team, i) => <MiniCard key={i} item={team} type="team" />)}
            </div>
        </section>
    )
}