'use client';

import { KeyboardEvent, MouseEvent, ReactNode, useEffect, useRef, useState } from "react";

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

export default function PostCardToggle({ avatar, children, collapsedComments, expandedComments, isTargeted = false }: {
    avatar: ReactNode,
    children: ReactNode,
    collapsedComments: ReactNode,
    expandedComments: ReactNode,
    isTargeted?: boolean
}) {
    const [showComments, setShowComments] = useState(isTargeted);
    const [isFlashing, setIsFlashing] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isTargeted) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setShowComments(true);
        setIsFlashing(true);

        const animationFrame = window.requestAnimationFrame(() => {
            cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        const flashTimeout = window.setTimeout(() => setIsFlashing(false), 1600);

        return () => {
            window.cancelAnimationFrame(animationFrame);
            window.clearTimeout(flashTimeout);
        };
    }, [isTargeted]);

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
        <div
            ref={cardRef}
            className={`flex flex-row items-start w-full rounded px-2 py-1 transition-colors duration-700 ${
                isFlashing ? "bg-yellow-200/60 dark:bg-yellow-700/35" : "bg-transparent"
            }`}
        >
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
