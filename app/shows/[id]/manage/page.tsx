import { getShow } from "@/lib/shows";
import { getCurrentUser } from "@/lib/users";
import { notFound } from "next/navigation";

export default async function ShowManagePage({ params } : {
    params: Promise<{ id: string }>
    }) {
    const { id } = await params;
    const show = id ? await getShow(id) : null;
    const user = await getCurrentUser();
    const isAdmin = user && show?.admins.includes(user.id);
    if (!isAdmin || !show) notFound();

    return (
        <section>
            {show.title}
        </section>
    )
}