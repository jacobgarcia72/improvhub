import { postShowCast } from "@/actions";
import { Border } from "@/components/border";
import CastingInputs from "@/components/form/casting-inputs";
import Form from "@/components/form/form";
import { getShow, getShowCast, getShowing } from "@/lib/shows";
import { getCurrentUserId } from "@/lib/users";
import { notFound, redirect } from "next/navigation";

export default async function ShowCastPage({ params } : {
    params: Promise<{ id: string, dateTime: string }>
    }) {
    const { id, dateTime } = await params;
    const showDate = dateTime.replaceAll('%20', ' ').replaceAll('%3A', ':');
    const showing = id ? await getShowing(id, showDate) : null;
    const parentShow = id ? await getShow(id) : null;
    const userId = await getCurrentUserId();
    const isAdmin = userId && parentShow?.admins.includes(userId);
    if (!showing || !parentShow || !isAdmin) notFound();

    const cast = await getShowCast(id, dateTime);

    const onCancel = async () => {
        'use server'
        redirect(`/shows/${id}/${dateTime}`);
    }

    return <Border className="py-2 px-4 my-1">
        <Form
            buttonCaption="Save Cast"
            cancel={onCancel}
            onSubmit={postShowCast.bind(null, id, dateTime)}>
            <CastingInputs
                currentCast={cast}
                roles={['director', 'tech', 'team', 'player', 'musician']}
            />
        </Form>
    </Border>
}