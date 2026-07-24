import ComingSoon from "@/components/coming-soon"
import { isDev } from "@/lib/app-info"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    if (!isDev) {
        return <ComingSoon />
    }
    return children
}