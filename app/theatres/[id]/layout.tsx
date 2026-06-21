import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loader from "@/components/loader";
import FollowButton from "@/components/follow-button";
import { getTheatre } from "@/lib/theatres";
import { getCurrentUserId, getFollowing } from "@/lib/users";
import Image from "next/image";
import { optimizeImage } from "@/lib/cloudinary";

type Props = {
    params: Promise<{ id: string }>
    children: React.ReactNode;
}

export default async function TeamLayout({ params, children }: Props) {
    const { id } = await params;
    const theatre = await getTheatre(id);

    if (!theatre) notFound();

    const userId = await getCurrentUserId();
    const following = userId ? (await getFollowing(userId, id, 'theatre')) || false : false;
    const { image } = theatre;

    return <>
        <Suspense fallback={<Loader />}>
            <section>
                <div className="w-full px-8">
                    <div className="w-full flex flex-row justify-between items-center">
                        <h1 className="text-2xl">{theatre.name}</h1>
                        {userId && <FollowButton userId={userId} followId={id} type="theatre" following={following} />}
                    </div>
                    {image ? (
                        <Image loading="eager" className="object-cover rounded-xl w-32 h-32"
                            src={optimizeImage(image, 320, 320, null, true)} alt={`${theatre.name} logo`} width={120} height={120} />
                    ) : null}
                </div>
            </section>
        </Suspense>
        {children}
    </>
}
