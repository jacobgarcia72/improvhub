import { postShowAdmins } from "@/actions";
import AdminsInputs from "@/components/form/admin-inputs";
import { getShow } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";
import ShowHeader from "../show-header";

export default async function ShowAdminsPage({ params }: {params: Promise<{ id: string }>}) {
    const { id } = await params;
    const show = await getShow(id);

    if (!show) notFound();

    const { admins } = show;
    const userId = await getCurrentUserId();
    const isAdmin = userId && admins.includes(userId);

    if (!isAdmin) notFound();

    const onCancel = async () => {
        'use server'
        redirect(`/shows/${id}`);
    }

    return <>
        <ShowHeader show={show} />
        <div className="mb-4">
            <h3 className="mt-3 mb-3 font-semibold text-sm">Show Page Admins</h3>
            <AdminsInputs
                currentAdmins={admins}
                onSubmit={postShowAdmins.bind(null, id)}
                cancel={onCancel}
            />
        </div>
    </>
}