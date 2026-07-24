import { isDev } from "@/lib/app-info";
import { notFound } from "next/navigation"

export default function DevLayout({ children }: { children: React.ReactNode }) {
    if (!isDev) notFound();
    return children
}