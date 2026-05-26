import Link from "next/link";
import NavLink from "./nav-link";
import ProfileImage from "./profile-image";

const links = ['Create', 'Search'];

export default function Header() {
    return (
        <header className="relative z-50 h-12 w-full flex flex-row justify-between items-stretch">
            <Link href="/">
                <div>Improv Hub</div>
            </Link>
            <nav className="flex flex-row">
                {links.map((link) => <ul key={link}><NavLink link={link}/></ul>)}
            </nav>
            <div className="flex flex-row">
                <Link href="/profile">
                    <ProfileImage />
                </Link>
            </div>
        </header>
    )
}