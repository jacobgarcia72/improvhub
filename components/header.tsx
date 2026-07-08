import Link from "next/link";
import ProfileImage from "./profile-image";
import NavLinks from "./nav-links";
import { appName } from "@/lib/app-info";
import Notifications from "./notifications";
import { getCurrentUser } from "@/lib/users";
import { getNotifications } from "@/lib/notifications";

export default async function Header() {
    const uid = (await getCurrentUser())?.uid;
    const notifications = uid ? await getNotifications(uid) : [];
    return (
        <header className="bg-[#556f8d] dark:bg-[#112247] px-6 text-[0.95em] relative z-50 h-11 w-full flex flex-row justify-between items-stretch">
            <Link href="/">
                <div className="hidden sm:flex font-semibold px-2 w-24 flex-row justify-center">
                    {appName}
                </div>
            </Link>
            <NavLinks />
            <div className="flex flex-row">
                {uid ? (
                    <Link href="/notifications" className="flex flex-row w-9 justify-center items-center group">
                        <Notifications uid={uid} initialData={notifications} />
                    </Link>
                ): null}
                <Link href="/profile" className="flex flex-row w-9 justify-center items-center group">
                    <ProfileImage />
                </Link>
            </div>
        </header>
    )
}