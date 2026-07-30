'use client';

import { useState } from "react";
import NavLink from "./nav-link";

export default function HamburgerMenu({ links }: { links: string[] }) {
    const [isOpen, setIsOpen] = useState(false);
    return <>
        <div
            onClick={() => setIsOpen(false)}
            className={`${!isOpen && 'hidden'} z-0 cursor-pointer w-full h-full fixed left-0 top-0 pt-11`}
        >
            <div className="w-full h-full bg-black opacity-84">
            </div>
        </div>
        <div className={`${!isOpen && 'hidden'} max-h-[calc(100vh-44px)] z-100 left-0 sm:left-30 hamburger-dropdown bg-[#556f8d] dark:bg-[#112247] border-[#556f8d] dark:border-[#112247] border-3 border-t-0 text-[1.1em] fixed top-11 flex flex-col flex-wrap`}>
            {links.map((link, i) => (
                <NavLink onClick={() => setIsOpen(false)} key={i} link={link} />
            ))}
        </div>
        <div className="z-100 h-full flex flex-col justify-center">
            <div onClick={() => setIsOpen(!isOpen)} className=" bg-[#556f8d] dark:bg-[#112247] hamburger relative px-2 pt-[2px] h-full w-12 justify-center items-center flex flex-col">
                <div className={`${isOpen ? 'rotate-45' : '-mt-[10px]'} transition-transform duration-200 absolute bg-slate-200 h-[2px] w-5 rounded mb-[4px]`}></div>
                <div className={`${isOpen ? 'opacity-0' : ''} transition-opacity duration-300 absolute bg-slate-200 h-[2px] w-5 rounded mb-[4px]`}></div>
                <div className={`${isOpen ? 'rotate-135' : 'mt-[10px]'} transition-transform duration-300 absolute bg-slate-200 h-[2px] w-5 rounded mb-[4px]`}></div>
            </div>
        </div>
    </>
}