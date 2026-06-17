import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/form/button";
import { getCurrentUserId } from "@/lib/users";
import { getShowsByAdmin, getShowsByCastMember } from "@/lib/shows";
import MiniCard from "@/components/mini-card";


export const metadata: Metadata = {
    title: `${appName} | Shows`,
    description: "Find improv shows near you!",
};

export default async function ShowsPage() {
    const userId = await getCurrentUserId();
    const showsManaged = userId ? await getShowsByAdmin(userId) : null;
    const showsUserIsIn = userId ? await getShowsByCastMember(userId) : null;
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
                    <h2 className="px-3 font-semibold">Shows I Manage</h2>
                    <div className="flex flex-row flex-wrap">
                        {showsManaged.map((show, i) => <MiniCard key={i} item={show} type="show" />)}
                    </div>
                </section>
            ) : null}
            {showsUserIsIn?.length ? (
                <section>
                    <h2 className="px-3 font-semibold">Shows I&#39;m In</h2>
                    <div className="flex flex-row flex-wrap">
                        {showsUserIsIn.map((show, i) => <MiniCard key={i} item={show} type="show" />)}
                    </div>
                </section>
            ) : null}
        </>
    )
}