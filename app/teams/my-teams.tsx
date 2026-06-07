import MiniCard from "@/components/mini-card";
import { getTeamsByUser } from "@/lib/teams";
import { getCurrentUser } from "@/lib/users";

export default async function MyTeams() {
    const user = await getCurrentUser();
    if (!user) return null;
    const teams = await getTeamsByUser(user.id);
    if (!teams?.length) return null;
    return (
        <section>
            <h2 className="px-3">My Teams</h2>
            {teams.map((team, i) => <MiniCard key={i} item={team} type="team" />)}
        </section>
    )
}