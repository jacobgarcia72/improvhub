'use client';

import { KeyboardEvent, MouseEvent, ReactNode, useState } from "react";

const interactiveSelector = [
    "a",
    "button",
    "input",
    "textarea",
    "select",
    "label",
    "form",
    "[role='button']",
    "[data-no-card-toggle]",
].join(",");

function clickedInteractiveElement(target: EventTarget) {
    return target instanceof HTMLElement && target.closest(interactiveSelector);
}

export default function PostCardToggle({ avatar, children, collapsedComments, expandedComments }: {
    avatar: ReactNode,
    children: ReactNode,
    collapsedComments: ReactNode,
    expandedComments: ReactNode
}) {
    const [showComments, setShowComments] = useState(false);

    const toggleComments = () => {
        setShowComments((current) => !current);
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        if (clickedInteractiveElement(event.target)) return;
        toggleComments();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (clickedInteractiveElement(event.target)) return;
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        toggleComments();
    };

    return (
        <div className="flex flex-row items-start w-full px-2">
            <div
                aria-expanded={showComments}
                className="cursor-pointer"
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                tabIndex={0}
            >
                {avatar}
            </div>
            <div className="sr-only" aria-live="polite">
                {showComments ? "Comments shown" : "Comments hidden"}
            </div>
            <div className="flex flex-col w-full gap-0.5 pl-2">
                <div
                    aria-expanded={showComments}
                    className="cursor-pointer"
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    {children}
                    <div className={showComments ? "hidden" : "contents"}>
                        {collapsedComments}
                    </div>
                </div>
                <div className={showComments ? "contents" : "hidden"}>
                    {expandedComments}
                </div>
            </div>
        </div>
    );
}
