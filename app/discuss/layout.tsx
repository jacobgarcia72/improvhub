import ComingSoon from "@/components/coming-soon"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    if (process.env.NODE_ENV === 'production') {
        return <ComingSoon />
    }
    return children
}