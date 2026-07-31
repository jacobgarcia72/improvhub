import Loader from "@/components/loader";

export default function LoadingPage({caption}: { caption?: string }) {
    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center">
            <Loader caption={caption || "page"} />
        </div>
    )
}