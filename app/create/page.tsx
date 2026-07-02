import Button from "@/components/form/button";
import Link from "next/link";

export default function CreatePage() {
    return (
        <section className="flex flex-col gap-4 items-center justify-center min-h-[50vh] small-section">
            <h1 className="text-lg">Create a New Page</h1>
            <Link href="create/show"><Button className="w-56" caption="Show" /></Link>
            <Link href="create/jam"><Button className="w-56" caption="Jam" /></Link>
            <Link href="create/team"><Button className="w-56" caption="Team" /></Link>
            <Link href="create/theatre"><Button className="w-56" caption="Theatre" /></Link>
        </section>
    )
}