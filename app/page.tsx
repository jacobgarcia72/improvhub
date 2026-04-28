import { appName } from "@/lib/app-info";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: `${appName} | Home`,
    description: "All things improv, all in one place. Find shows, teams, theatres, jams, auditions, and more near you!",
};

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Home Page
    </div>
  );
}