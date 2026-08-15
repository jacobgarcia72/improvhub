import Link from "next/link";

export default function AdminPage() {
    return (
        <div className="flex flex-col gap-2">
            <Link className="link" href="/admin/review-theatre-claims">
                Review Theatre Claims
            </Link>
        </div>
    )
}
