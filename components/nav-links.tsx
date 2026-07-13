import Link from "next/link";
import HamburgerMenu from "./hamburger-menu";
import NavLink from "./nav-link";
import { appName } from "@/lib/app-info";

const allLinks = ['Feed', 'Create', 'Search', 'Shows', 'Jams', 'Classes', 'Workshops', 'Troupes', 'Chat', 'Support', 'Feedback'];
const topLinks = ['Create', 'Search', 'Shows', 'Jams', 'Classes', 'Troupes', 'Chat'];
const topLinksShortList = ['Create', 'Search', 'Shows', 'Troupes', 'Chat'];

export default function NavLinks() {
    return <>
        <div className="flex sm:w-auto w-full">
            <HamburgerMenu links={allLinks} />
            <div className="w-full sm:hidden flex flex-row justify-center">
                <Link href="/">
                    <div className="flex sm:hidden font-semibold px-2 w-24 flex-row justify-center">
                        {appName}
                    </div>
                </Link>
            </div>
        </div>
        <nav className="hidden sm:flex md:hidden flex-row w-full justify-center">
            {topLinksShortList.map((link) => <ul key={link}><NavLink link={link}/></ul>)}
        </nav>
        <nav className="hidden md:flex lg:hidden flex-row w-full justify-center">
            {topLinks.map((link) => <ul key={link}><NavLink link={link}/></ul>)}
        </nav>
        <nav className="hidden lg:flex flex-row w-full justify-center">
            {allLinks.slice(1).map((link) => <ul key={link}><NavLink link={link}/></ul>)}
        </nav>
    </>
}