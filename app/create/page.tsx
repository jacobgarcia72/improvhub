import Button from "@/components/form/button";
import Link from "next/link";

export default function CreatePage() {
    return (
        <section className="flex flex-col gap-4 items-center justify-center min-h-[50vh] small-section">
            <Link href="create/show"><Button className="w-56" caption="Show" type="button" /></Link>
            <Link href="create/team"><Button className="w-56" caption="Team" type="button" /></Link>
        </section>
    )
}