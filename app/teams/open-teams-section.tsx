import MiniCard from "@/components/mini-card";
import { pluralize } from "@/lib/helper-functions";
import { getOpenTeams } from "@/lib/teams";
import { Role, User } from "@/types";

export default async function OpenTeamsSection({
    role,
    user
} : {
    role: Role,
    user: User
}) {
    const teams = await getOpenTeams(user, role)
    if (!teams?.length) return null;
    return (
        <section>
            <h2 className="px-3">{`Teams looking for ${pluralize(role)}`}</h2>
            <div className="flex flex-row flex-wrap">
                {teams.map((team, i) => <MiniCard key={i} item={team} type="team" />)}
            </div>
        </section>
    )
}