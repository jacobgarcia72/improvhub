import { getTopics } from "@/lib/chat"

export default async function MessagesBody({ room, topic }: { room: string | null, topic: string | null }) {
    if (!room) {
        return (
            <section>
                <p>Select Chat Room</p>
            </section>
        )
    } else if (topic) {
        return (
            <section>
                (posts)
            </section>
        )
    } else {
        const topics = await getTopics(room);
    return (
            <section>
                {topics.map(({ id, title, description }) => (
                    <div key={id}>
                        <h3>{title}</h3>
                        {description ? <p>{description.replaceAll('<br>', '\n')}</p> : null}
                    </div>
                ))}
            </section>
        )
    }
}