import { approveTheatreClaimAction, rejectTheatreClaimAction } from "@/actions";
import Button from "@/components/form/button";
import { getPendingTheatreClaims } from "@/lib/admins";
import { getTheatre } from "@/lib/theatres";
import { getUserAbbreviated } from "@/lib/users";
import Link from "next/link";

export default async function ReviewTheatreClaimsPage() {
    const claims = await getPendingTheatreClaims();

    const claimDetails = await Promise.all(claims.map(async (claim) => ({
        claim,
        theatre: await getTheatre(claim.theatreId),
        claimant: await getUserAbbreviated(claim.claimantId),
    })));

    return (
        <div>
            <h2 className="mb-3 text-lg font-semibold">Review Theatre Claims</h2>
            {!claimDetails.length ? (
                <p className="text-sm text-slate-700 dark:text-slate-300">No pending theatre claims.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {claimDetails.map(({ claim, theatre, claimant }) => (
                        <article key={claim.id} className="border-b border-b-black/15 pb-4 dark:border-b-white/15">
                            <div className="mb-2 flex flex-col gap-1">
                                <p>
                                    <span className="font-semibold">Theatre: </span>
                                    {theatre ? (
                                        <Link className="link" href={`/theatres/${theatre.id}`}>
                                            {theatre.name}
                                        </Link>
                                    ) : (
                                        claim.theatreId
                                    )}
                                </p>
                                <p>
                                    <span className="font-semibold">Claimant: </span>
                                    {claimant ? (
                                        <Link className="link" href={`/profile/${claimant.id}`}>
                                            {claimant.name}
                                        </Link>
                                    ) : (
                                        claim.claimantId
                                    )}
                                </p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    Submitted {new Date(claim.claimedAt).toLocaleString()}
                                </p>
                            </div>
                            <p className="mb-3 whitespace-pre-wrap rounded border border-slate-300 p-3 text-sm dark:border-slate-700">
                                {claim.proof}
                            </p>
                            <div className="flex flex-row flex-wrap gap-2">
                                <form action={approveTheatreClaimAction}>
                                    <input type="hidden" name="claimId" value={claim.id} />
                                    <Button submit caption="Approve" className="green" />
                                </form>
                                <form action={rejectTheatreClaimAction}>
                                    <input type="hidden" name="claimId" value={claim.id} />
                                    <Button submit caption="Reject" className="red" />
                                </form>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}
