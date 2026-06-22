import Button from "@/components/form/button";
import { appName } from "@/lib/app-info";
import { getCurrentUserId } from "@/lib/users";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: `${appName} | Home`,
    description: "All things improv, all in one place. Find shows, teams, theatres, jams, auditions, and more near you!",
};

export default async function Home() {
  if (await getCurrentUserId()) {
    redirect('/feed');
  }
  return (
    <div className="min-h-[calc(90vh-44px)] flex flex-col justify-center items-center">
      <section className="min-h-[calc(84vh-44px)] flex flex-col justify-center items-center">
        <div className="text-slate-800 min-h-[calc(70vh-44px)] flex flex-col justify-evenly items-center">
          <div className="w-full flex flex-row justify-center items-center">
            <h1 className="text-4xl font-black mb-4">{appName}</h1>
          </div>
          <div className="flex flex-row flex-wrap justify-evenly gap-2 pb-10 sm:pb-20 px-8">
            <div className="py-2 min-w-48 w-5/12 flex flex-col justify-end items-center gap-4">
              <div className="h-full flex items-center justify-center">
                <p className="text-lg text-center">Find improv shows, jams, and theatres near you!</p>
              </div>
              <Link href="/search" className="w-54 max-w-11/12">
                <Button caption="Search" className="w-full" />
              </Link>
            </div>
            <div className="py-2 min-w-48 w-5/12 flex flex-col justify-end items-center gap-4">
              <div className="h-full flex items-center justify-center">
                <p className="text-lg text-center">Create and manage teams and events and connect with other improvisers!</p>
              </div>
              <Link href="/login" className="w-54 max-w-11/12">
                <Button caption="Sign In" className="w-full" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}