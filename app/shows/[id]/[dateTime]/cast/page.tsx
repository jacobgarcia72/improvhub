import { postShowCast } from "@/actions";
import { Border } from "@/components/border";
import CastingInputs from "@/components/form/casting-inputs";
import Form from "@/components/form/form";
import { getShow, getShowing } from "@/lib/shows";
import { getCurrentUser } from "@/lib/users";
import { notFound } from "next/navigation";

export default async function ShowCastPage({ params } : {
    params: Promise<{ id: string, dateTime: string }>
    }) {
    const { id, dateTime } = await params;
    const showDate = dateTime.replace('%20', ' ').replace('%3A', ':');
    const showing = id ? await getShowing(id, showDate) : null;
    const parentShow = id ? await getShow(id) : null;
    const user = await getCurrentUser();
    const isAdmin = user && parentShow?.admins.includes(user.id);
    if (!showing || !parentShow || !isAdmin) notFound();

    return <Border className="py-2 px-4 my-1">
        <Form
            buttonCaption="Save Cast"
            onSubmit={postShowCast.bind(null, id, dateTime)}>
            <CastingInputs roles={['director', 'tech', 'team', 'player', 'musician']} />
        </Form>
    </Border>
}