import Loader from "@/components/loader";
import { protectRoute } from "@/lib/auth";
import { Suspense } from "react";

export default async function CreateLayout(
    { children }: Readonly<{ children: React.ReactNode }>
) {
    await protectRoute();
    return <Suspense fallback={<Loader />}>{children}</Suspense>;
}