import Link from "next/link";
import ProfileImage from "./profile-image";
import NavLinks from "./nav-links";
import { appName } from "@/lib/app-info";

export default function Header() {
    return (
        <header className="bg-[#556f8d] dark:bg-[#112247] px-6 text-[0.95em] relative z-50 h-11 w-full flex flex-row justify-between items-stretch">
            <Link href="/">
                <div className="hidden sm:flex font-semibold px-2 w-24 flex-row justify-center">
                    {appName}
                </div>
            </Link>
            <NavLinks />
            <div>
                <Link href="/profile" className="flex flex-row w-12 justify-center items-center">
                    <ProfileImage />
                </Link>
            </div>
        </header>
    )
}