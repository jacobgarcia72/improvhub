
'use client'
import { useEffect } from "react";

export default function BuyMeACoffee() {
    useEffect(() => {
        const script = document.createElement("script");
        const div = document.getElementById("buy-me-a-coffee");
        script.setAttribute(
            "src",
            "https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        );
        script.setAttribute("data-name", "BMC-Widget");
        script.setAttribute("data-cfasync", "false");
        script.setAttribute("data-id", "jacobgarcia25");
        script.setAttribute("data-description", "Buy me a coffee so I can continue developing this site!");
        script.setAttribute(
            "data-message",
            "Support the site!"
        );
        script.setAttribute("data-color", "#2098dd");
        script.setAttribute("data-position", "Right");
        script.setAttribute("data-x_margin", "18");
        script.setAttribute("data-y_margin", "18");
        script.setAttribute("data-transform", "scale(0.5)");

        script.onload = function () {
            const event = new Event('DOMContentLoaded', { bubbles: true, cancelable: true });
            window.dispatchEvent(event);
        };
        
        div?.appendChild(script);

    }, []);

    return <div id="buy-me-a-coffee"></div>;
}

