import TheatreForm from "@/components/form/theatre-form";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation";

export default async function CreateTheatrePage() {
    const userId = await getCurrentUserId();
    if (!userId) notFound();
    return <TheatreForm userId={userId} />
}