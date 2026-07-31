import { getChatRooms } from "@/lib/chat"
import { getCurrentUser } from "@/lib/users";
import { redirect } from "next/navigation";
import MessagesHeader from "./header";
import MessagesBody from "./body";
import { SearchParams } from "next/dist/server/request/search-params";
import { Metadata } from "next";
import { appName } from "@/lib/app-info";
import { Theatre } from "@/types";
import { getTheatre } from "@/lib/theatres";
import { Suspense } from "react";
import Loader from "@/components/loader";

export const metadata: Metadata = {
    title: `Discussions | ${appName}`
};

export default async function ChatPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const { channel, topic } = await searchParams;
    const user = await getCurrentUser();
    if (!user) {
        redirect(`/login?reroute=discuss`);
    }
    const chatRooms = await getChatRooms(user.id);
    let theatre: Theatre | null = null;
    if (typeof channel === 'string' && channel.startsWith('theatre-')) {
        const theatreId = channel.split('-').slice(1).join('-');
        theatre = await getTheatre(theatreId);
    }
    return <>
        <Suspense fallback={<Loader caption="channels" />}>
            <MessagesHeader chatRooms={chatRooms} theatre={theatre} />
        </Suspense>
        <Suspense fallback={<Loader />}>
            <MessagesBody user={user} room={channel as string || null} topic={topic as string || null} />
        </Suspense>
    </>
}
