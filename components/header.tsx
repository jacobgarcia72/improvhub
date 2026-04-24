import Link from "next/link";
import NavLink from "./nav-link";

const links = ['Shows', 'Auditions', 'Jams', 'Theatres', 'Teams', 'Discussion'];

export default function Header() {
    return (
        <header className="h-12 flex flex-row justify-between items-stretch">
            <Link href="/">
                <div>Improv Hub</div>
            </Link>
            <nav className="flex flex-row">
                {links.map((link) => <ul key={link}><NavLink link={link}/></ul>)}
            </nav>
            <div className="flex flex-row">
                <Link href="/profile">
                    <div>S</div>
                </Link>
                <Link href="/profile">
                    <div>P</div>
                </Link>
            </div>
        </header>
    )
}