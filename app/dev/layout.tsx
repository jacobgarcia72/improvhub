import {isProd } from "@/lib/app-info";
import { getCurrentUserId } from "@/lib/users";
import { notFound } from "next/navigation"

export default async function DevLayout({ children }: { children: React.ReactNode }) {
    if (isProd || (await getCurrentUserId()) !== 'yockub') notFound();
    return children
}