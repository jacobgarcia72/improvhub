import Button from "@/components/form/button";
import Link from "next/link";

export default function CastingTools({ id }: { id: string }) {
    return (
        <>
            <Link href={`/shows/${id}/cast`}>
                <Button caption="Cast Show" />
            </Link>
        </>
    )
}