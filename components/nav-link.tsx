"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ link }: {
    link: string,
}) {
    const path = usePathname();
    const href = `/${link.toLowerCase()}`;
    return (
        <Link href={href} className={path.startsWith(href) ? 'active' : ''}>
            <div>
                {link}
            </div>
        </Link>
    )
}
