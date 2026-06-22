import HamburgerMenu from "./hamburger-menu";
import NavLink from "./nav-link";

const links = ['Create', 'Search', 'Shows', 'Jams', 'Teams', 'Messages'];

export default function NavLinks() {
    return <>
        <nav className="hidden sm:flex flex-row w-full justify-center">
            {links.map((link) => <ul key={link}><NavLink link={link}/></ul>)}
        </nav>
        <div className="block sm:hidden w-full">
            <HamburgerMenu links={links} />
        </div>
    </>
}