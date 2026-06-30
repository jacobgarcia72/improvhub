import Loader from "@/components/loader";
import { protectRoute } from "@/lib/auth";
import { Suspense } from "react";
import { Metadata } from "next";
import { appName } from "@/lib/app-info";

export const metadata: Metadata = {
    title: `Create | ${appName}`
};

export default async function CreateLayout(
    { children }: Readonly<{ children: React.ReactNode }>
) {
    await protectRoute();
    return <Suspense fallback={<Loader />}>{children}</Suspense>;
}