import { Border } from "@/components/border";
import { optimizeImage } from "@/lib/optimize-image";
import { getPronounForm } from "@/lib/demographics";
import { getTeam } from "@/lib/teams";
import { getUser } from "@/lib/users";
import { TeamMember } from "@/types";
import Image from "next/image";
import Link from "next/link";
import TeamInvitationOptions from "./team-invitation-options";
import { getVerbFromRole } from "@/lib/helper-functions";

export default async function TeamInvitation({ teamMembership }: { teamMembership: TeamMember }) {
    const team = await getTeam(teamMembership.team);
    const inviter = await getUser(teamMembership.addedBy);
    const user = teamMembership.id ? await getUser(teamMembership.id) : null;
    if (!team || !inviter || !user) return null;
    return (
        <Border className="w-full mb-2">
            <div className="flex flex-row min-h-[80px]">
                {team.image ? (
                    <div className="w-[100px] h-full">
                        <Link className="link" href={`teams/${team.id}`}>
                            <Image className="w-[100px] max-w-[100px] h-[100px] object-cover"
                                src={optimizeImage(team.image, 200, 200, 80, true)}
                                alt={team.name} width={100} height={100}
                            />
                        </Link>
                    </div>
                ) : <div className="w-[32px]" />}
                <div className="py-3 px-4 w-full flex flex-col justify-center">
                    <p className="cursor-default">
                        <Link className="link" href={`profile/${inviter.id}`}>{`${inviter.firstName} ${inviter.lastName}`}</Link>
                        {` has invited you to ${getVerbFromRole(teamMembership.role)} ${getPronounForm(inviter.pronouns, 2)} team, `}
                        <Link className="link" href={`teams/${team.id}`}>{`${team.name}!`}</Link>
                    </p>
                    <TeamInvitationOptions teamId={team.id} userId={user.id} role={teamMembership.role} />
                </div>
            </div>
        </Border>
    )
}