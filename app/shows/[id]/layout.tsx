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
    if (!show) return { }
    const { title: name, description, image } = show;
    const title = `${name} | ${appName}`;
    const metadata: Metadata = { title, description }
    if (image) {
        metadata.openGraph = {
            images: [{ url: image, alt: name }],
        }
    }
    return metadata;
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