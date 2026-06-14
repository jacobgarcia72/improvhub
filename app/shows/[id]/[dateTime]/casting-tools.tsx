import Button from "@/components/form/button";
import Link from "next/link";

export default function CastingTools({ id, showDate }: { id: string, showDate: string }) {
    return (
        <>
            <Link href={`/shows/${id}/${showDate}/cast`}>
                <Button style="link" caption="Manage Cast and Open Positions" />
            </Link>
        </>
    )
}