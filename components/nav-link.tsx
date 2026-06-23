"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ link, onClick }: {
    link: string,
    onClick?: () => void
}) {
    const path = usePathname();
    const href = `/${link.toLowerCase()}`;
    return (
        <Link onClick={onClick || undefined} href={href} className={path.startsWith(href) ? 'active' : ''}>
            <div className="flex flex-row min-w-18 px-1 justify-center">
                {{
                    'Feed': 'Live Feed',
                    'Search': 'Find',
                    'Chat': 'Discussion'
                }[link] || link}
            </div>
        </Link>
    )
}
