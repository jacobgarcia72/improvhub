import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Search from "./search";

export const metadata: Metadata = {
    title: `${appName} | Search`,
};

export default function SearchPage() {
    return (
        <Search />
    )
}