import { Border } from "@/components/border";
import { formatDate } from "@/lib/dates";
import { getFeedback } from "@/lib/feedback";
import { getUser } from "@/lib/users";
import Link from "next/link";


export default async function ReadFeedbackPage() {
    const feedbackItems = await getFeedback();
    return (
        <div className="flex flex-col gap-2 w-[99vw] max-w-[600px]">
            {feedbackItems.map(async ({ feedback, id, userId, date }) => {
                const user = await getUser(userId);
                return (
                    <Border key={id} className="py-4 px-6">
                        <p className="text-xs">{formatDate(new Date(date))}</p>
                        <p className="mb-2"><Link className="link" href={`/profile/${userId}`}>{`${user?.firstName} ${user?.lastName}`}</Link>{user?.city ? ` from ${user.city} ${user.state || ''}` : ''}:</p>
                        <div className="border border-black bg-black/90 text-white py-2 px-4 rounded">{feedback.split('<br>').map((line, i) => <p key={i}>{line}</p>)}</div>
                    </Border>
                )
            })}
        </div>
    )
}