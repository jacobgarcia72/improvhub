import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Theatres`,
    description: "Find improv theatres near you!",
};

export default function TheatresPage() {
    return (
        <h1>Theatres Page</h1>
    )
}