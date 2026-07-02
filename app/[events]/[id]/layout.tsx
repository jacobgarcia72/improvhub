import { appName } from "@/lib/app-info";
import { singularize } from "@/lib/helper-functions";
import { getEvent } from "@/lib/shows";
import { EventType } from "@/types";
import type { Metadata } from 'next'

type Props = {
    params: Promise<{ id: string, events: string }>;
    children: React.ReactNode;
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    const { id, events } = await params;
    const type = singularize(events);
    if (!['show', 'jam', 'class', 'workshop'].includes(type)) {
        return {};
    }
    const event = await getEvent(id, type as EventType);
    if (!event) return { }
    const { title: name, description, image } = event;
    const title = `${name} | ${appName}`;
    const metadata: Metadata = { title, description }
    if (image) {
        metadata.openGraph = {
            images: [{ url: image, alt: name }],
        }
    }
    return metadata;
}

export default async function DetailsLayout({ children }: Props) {

    return (
        <section>
            <div className="px-4">
                {children}
            </div>
        </section>
    )
}