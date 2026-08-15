import { postTheatreAdmins } from "@/actions";
import AdminsInputs from "@/components/form/admin-inputs";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";

export default async function TheatreAdminsPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const theatre = await getTheatre(id);
    if (!theatre) notFound();

    const userId = await getCurrentUserId();
    if (!userId || !theatre.admins?.includes(userId)) notFound();

    const onCancel = async () => {
        'use server'
        redirect(`/theatres/${id}`);
    }

    return (
        <section className="medium-section">
            <h3 className="mt-3 mb-3 font-semibold text-sm">Theatre Admins</h3>
            <AdminsInputs
                currentAdmins={theatre.admins || []}
                onSubmit={postTheatreAdmins.bind(null, id)}
                cancel={onCancel}
            />
        </section>
    )
}
