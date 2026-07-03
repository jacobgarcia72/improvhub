import SupportLinks from "@/components/support-links";
import { appName } from "@/lib/app-info";
import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: `Support | ${appName}`
};

export default function SupportPage() {
    return (
        <section className="medium-section">
            <p>Hello friend!</p><br />
            <p>I am a one-man development team creating {appName} as a passion project for my love of improv.</p><br />
            <p>Your support is greatly appreciated and will allow me to spend more time building up and maintaining this site.</p><br />
            <p>Here are a couple of links you can use to send me financial support:</p><br />
            <SupportLinks /><br />
            <p>Other ways you can help:</p><br />
            <ul className="list-disc pl-6">
                <li>Share this website with friends, classmates, and others in the improv community</li><br />
                <li><Link className="link" href="/create">Create</Link> and share pages for your theatre, troupe, shows, jams, and workshops</li><br />
                <li>Use the <Link className="link" href="/feedback">feedback page</Link> to report bugs and suggest improvements or new features</li>
            </ul><br />
            <p>Thank you!</p><br />
            <p>Jacob Garcia</p><br />
        </section>
    )
}