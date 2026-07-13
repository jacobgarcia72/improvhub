import { Border } from "@/components/border";
import { optimizeImage } from "@/lib/optimize-image";
import { getPronounForm } from "@/lib/demographics";
import { getTroupe } from "@/lib/troupes";
import { getUser } from "@/lib/users";
import { TroupeMember } from "@/types";
import Image from "next/image";
import Link from "next/link";
import TroupeInvitationOptions from "./troupe-invitation-options";
import { getVerbFromRole } from "@/lib/helper-functions";

export default async function TroupeInvitation({ troupeMembership }: { troupeMembership: TroupeMember }) {
    const troupe = await getTroupe(troupeMembership.troupe);
    const inviter = await getUser(troupeMembership.addedBy);
    const user = troupeMembership.id ? await getUser(troupeMembership.id) : null;
    if (!troupe || !inviter || !user) return null;
    return (
        <Border className="w-full mb-2">
            <div className="flex flex-row min-h-[80px]">
                {troupe.image ? (
                    <div className="w-[100px] h-full">
                        <Link className="link" href={`troupes/${troupe.id}`}>
                            <Image className="w-[100px] max-w-[100px] h-[100px] object-cover"
                                src={optimizeImage(troupe.image, 200, 200, 80, true)}
                                alt={troupe.name} width={100} height={100}
                            />
                        </Link>
                    </div>
                ) : <div className="w-[32px]" />}
                <div className="py-3 px-4 w-full flex flex-col justify-center">
                    <p className="cursor-default">
                        <Link className="link" href={`profile/${inviter.id}`}>{`${inviter.firstName} ${inviter.lastName}`}</Link>
                        {` has invited you to ${getVerbFromRole(troupeMembership.role)} ${getPronounForm(inviter.pronouns, 2)} troupe, `}
                        <Link className="link" href={`troupes/${troupe.id}`}>{`${troupe.name}!`}</Link>
                    </p>
                    <TroupeInvitationOptions troupeId={troupe.id} userId={user.id} role={troupeMembership.role} />
                </div>
            </div>
        </Border>
    )
}