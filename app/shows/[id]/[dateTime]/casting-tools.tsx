import Button from "@/components/form/button";
import Link from "next/link";

export default function CastingTools({ id, showDate }: { id: string, showDate: string }) {
    return (
        <div className="w-full flex justify-center">
            <Link href={`/shows/${id}/${showDate}/cast`}>
                <Button caption="Manage Cast and Open Positions" />
            </Link>
        </div>
    )
}