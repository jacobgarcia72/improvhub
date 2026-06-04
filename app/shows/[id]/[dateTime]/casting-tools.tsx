import Button from "@/components/form/button";
import Link from "next/link";

export default function CastingTools({ id, showDate, buttonCaption }: { id: string, showDate: string, buttonCaption?: string }) {
    return (
        <>
            <Link href={`/shows/${id}/${showDate}/cast`}>
                <Button caption={buttonCaption || 'Cast Show'} />
            </Link>
        </>
    )
}