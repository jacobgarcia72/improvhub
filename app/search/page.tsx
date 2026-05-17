import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import SearchBar from "./search-bar";
import SearchResults from "./search-results";

export const metadata: Metadata = {
    title: `${appName} | Search`,
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const params = await searchParams;
    return (
        <>
            <SearchBar />
            <SearchResults params={params} />
        </>
    )
}