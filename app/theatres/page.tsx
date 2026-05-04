import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import TheatreSearch from "./theatre-search";

export const metadata: Metadata = {
    title: `${appName} | Theatres`,
    description: "Find improv theatres near you!",
};

export default function TheatresPage() {
    return (
        <main>
            <TheatreSearch />
        </main>
    )
}