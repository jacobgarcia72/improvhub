import { getUser } from "@/lib/users";
import { User } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";

function LayoutCard({
  children, className, header
}: Readonly<{
  children?: React.ReactNode, className?: string, header?: string
}>) {
    if (!children) return null;
    return (
        <section className={className}>
            {header && <h2 className="text-slate-700 font-semibold">{header}</h2>}
            {children}
        </section>
    )
}

export default async function UserProfilePage({ params }: { params: Promise<{username: string}> }) {

    const { username } = await params;
    const user = await getUser(username) as User | undefined;

    if (!user) notFound();
    let displayName = user.firstName;
    let initials = user.firstName[0];
    if (user.lastName) {
        displayName += ` ${user.lastName[0]}.`
        initials += user.lastName[0];
    }
    let theatres = user.theatre || '';
    if (theatres && user.secondaryTheatre) theatres += `, ${user.secondaryTheatre}`
    user.bio = 'I am an improviser and this is my bio'
    user.experience = 'I have a lot of experience, mate'
    user.website = 'website.com'
    theatres = 'The Hideout Theatre'
    return (
        <Suspense fallback={<p>Loading</p>}>
            <LayoutCard className="flex flex-row">
                <div>
                    {user.image ? (
                        <Image className="object-cover rounded-xl w-32 h-32"
                            src={user.image} alt={displayName} width={120} height={120} />
                    ) : (
                        <div className="h-full w-full">{initials}</div>
                    )}
                </div>
                <div className="pl-2 flex items-end">
                    <h1 className="text-xl">{displayName}{user.pronouns && <span className="text-sm">&nbsp;({user.pronouns})</span>}</h1>
                    {user.headline && <h2>{user.headline}</h2>}
                </div>
            </LayoutCard>
            <LayoutCard header="Bio">
                {user.bio}
            </LayoutCard>
            <LayoutCard header="Theatres">
                {theatres}
            </LayoutCard>
            <LayoutCard header="Experience">
                {user.experience}
            </LayoutCard>
            <LayoutCard header="Website">
                {user.website && <a href={user.website}>{user.website}</a>}
            </LayoutCard>
        </Suspense>
    )
}