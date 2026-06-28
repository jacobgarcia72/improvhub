import TheatreForm from "@/components/form/theatre-form";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>
}

export default async function ManageTheatre({ params }: Props) {
    const { id } = await params;
    const theatre = await getTheatre(id);
    if (!theatre) notFound();

    const userId = await getCurrentUserId();
    const canManage = userId && (
        !theatre.admins?.length || theatre.admins.includes(userId)
    );
    if (!canManage) notFound();

    return (
        <TheatreForm theatre={theatre} userId={userId} />
    )
}
