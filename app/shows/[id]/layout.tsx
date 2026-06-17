import { appName } from "@/lib/app-info";
import { getShow } from "@/lib/shows";
import type { Metadata } from 'next'

type Props = {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { id } = await params
    const show = await getShow(id);

    return {
        title: show?.title || appName,
        description: show?.description || show?.theatre || 'Show details unavailable'
    }
}

export default async function ShowDetailsLayout({ children }: Props) {

    return (
        <section>
            <div className="px-4">
                {children}
            </div>
        </section>
    )
}