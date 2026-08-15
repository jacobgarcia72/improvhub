import TheatreClaimForm from "@/components/theatre-claim-form";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";

export default async function TheatreClaimPage({ params, searchParams }: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ submitted?: string }>
}) {
    const { id } = await params;
    const { submitted } = await searchParams;
    const theatre = await getTheatre(id);
    if (!theatre) notFound();

    if (theatre.admins?.length) redirect(`/theatres/${id}`);

    const userId = await getCurrentUserId();
    if (!userId) redirect(`/login?reroute=theatres%2F${id}%2Fclaim`);

    if (submitted === 'true') {
        return (
            <section className="px-6">
                <h3 className="mb-2 font-semibold">Claim Submitted</h3>
                <p className="mb-3 text-sm text-slate-700 dark:text-slate-300">
                    Your claim has been submitted for review.
                </p>
            </section>
        )
    }

    return (
        <TheatreClaimForm theatreId={id} theatreName={theatre.name} />
    )
}
