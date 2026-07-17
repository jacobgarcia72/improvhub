import Button from "@/components/form/button";
import Link from "next/link";

export default function CreatePage() {
    return (
        <section className="flex flex-col items-center min-h-[50vh] medium-section">
            <h1 className="text-xl text-gray-700 dark:text-gray-300 my-4">Create a New Page</h1>
            <div className="flex flex-wrap flex-row gap-4 justify-center mb-6">
                <div className="flex flex-col gap-4 items-center justify-center">
                    <Link href="create/troupe"><Button className="w-56" caption="Troupe" /></Link>
                    <Link href="create/theatre"><Button className="w-56" caption="Theatre" /></Link>
                    <Link href="create/show"><Button className="w-56" caption="Show" /></Link>
                </div>
                <div className="flex flex-col gap-4 items-center justify-center">
                    <Link href="create/jam"><Button className="w-56" caption="Jam" /></Link>
                    <Link href="create/class"><Button className="w-56" caption="Class" /></Link>
                    <Link href="create/workshop"><Button className="w-56" caption="Workshop" /></Link>
                </div>
            </div>
        </section>
    )
}