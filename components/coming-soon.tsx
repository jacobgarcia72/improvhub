import SupportLinks from "./support-links";

export default function ComingSoon() {
    return (
        <section className="small-section flex flex-col gap-3">
            <h1 className="text-xl mb-1">This page is coming soon!</h1>
            <p>In the meantime, your support will allow me to continue working on this site.</p>
            <SupportLinks />
            <p>Thank you!</p>
            <p className="pb-4">Jacob Garcia</p>
        </section>
    )
}