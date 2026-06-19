import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/form/button";
import { getCurrentUserId } from "@/lib/users";
import { getShowsByAdmin, getShowsByCastMember } from "@/lib/shows";
import MiniCard from "@/components/mini-card";
import { Event } from "@/types";
import UserShows from "@/components/upcoming-shows";


export const metadata: Metadata = {
    title: `${appName} | Shows`,
    description: "Find improv shows near you!",
};

export default async function ShowsPage() {
    const userId = await getCurrentUserId();
    const showsManaged = userId ? await getShowsByAdmin(userId) : null;
    const showsUserIsIn = userId ? await getShowsByCastMember(userId) : null;
    const showsByDate: { dateTime: string, show: Event }[] = [];
    showsUserIsIn?.forEach(({ show, dateTimes }) => {
        dateTimes.forEach((dateTime) => {
            showsByDate.push({ dateTime, show });
        })
    });
    showsByDate.sort((a, b) => {
        return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
    });
    return (
        <>
            <section className="flex flex row gap-2">
                <Link href="/create/show">
                    <Button caption="New Show" />
                </Link>
                <Link href="/search?for=shows">
                    <Button caption="Find Shows" />
                </Link>
            </section>
            {showsManaged?.length ? (
                <section>
                    <h2 className="text-slate-700 font-semibold">Shows I Manage</h2>
                    <div className="flex flex-row flex-wrap">
                        {showsManaged.map((show, i) => <MiniCard key={i} item={show} type="show" />)}
                    </div>
                </section>
            ) : null}
            {userId ? <UserShows includeTeams label="Shows I'm In" id={userId} /> : null}
        </>
    )
}