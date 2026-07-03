import Link from "next/link";
import HamburgerMenu from "./hamburger-menu";
import NavLink from "./nav-link";
import { appName } from "@/lib/app-info";

const links = ['Create', 'Search', 'Shows', 'Jams', 'Classes', 'Workshops', 'Teams', 'Chat'];

export default function NavLinks() {
    return <>
        <nav className="hidden sm:flex flex-row w-full justify-center">
            {links.map((link) => <ul key={link}><NavLink link={link}/></ul>)}
        </nav>
        <div className="flex sm:hidden w-full">
            <HamburgerMenu links={links} />
            <div className="w-full flex flex-row justify-center">
                <Link href="/">
                    <div className="flex sm:hidden font-semibold px-2 w-24 flex-row justify-center">
                        {appName}
                    </div>
                </Link>
            </div>
        </div>
    </>
}