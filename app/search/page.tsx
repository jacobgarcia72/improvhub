import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import SearchBar from "./search-bar";
import SearchResults from "./search-results";
import { getCurrentUser } from "@/lib/users";
import { getTheatre } from "@/lib/theatres";

export const metadata: Metadata = {
    title: `Search | ${appName}`,
    description: 'Find improv shows, jams, and theatres near you!'
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const params = await searchParams;
    const user = await getCurrentUser();
    const theatres = user?.theatres?.length ? await Promise.all(user?.theatres?.map(async (t) => await getTheatre(t) || t)) : undefined;
    return (
        <>
            <SearchBar theatres={theatres} />
            <SearchResults params={params} />
        </>
    )
}
