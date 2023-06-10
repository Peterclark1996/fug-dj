import moment from "moment"
import QueuedMediaDto from "../../../dtos/QueuedMediaDto"
import QueuedMedia from "./QueuedMedia"

type QueuePanelProps = {
    userId: string
    roomQueue: QueuedMediaDto[]
    userQueue: QueuedMediaDto[]
    removeMediaFromServerQueue: () => void
    removeMediaFromLocalQueue: (media: QueuedMediaDto) => void
}

const QueuePanel = ({
    userId,
    roomQueue,
    userQueue,
    removeMediaFromServerQueue,
    removeMediaFromLocalQueue
}: QueuePanelProps) => {
    const orderedUserQueue = userQueue.sort((a, b) => moment(a.timeQueued).valueOf() - moment(b.timeQueued).valueOf())
    const orderedRoomQueue = roomQueue.sort((a, b) => moment(a.timeQueued).valueOf() - moment(b.timeQueued).valueOf())

    const completeOrderedQueue: (QueuedMediaDto & { origin: "server" | "client" })[] = [
        ...orderedRoomQueue.map(m => ({ ...m, origin: "server" as const })),
        ...orderedUserQueue.map(m => ({ ...m, origin: "client" as const }))
    ]

    return (
        <div className="flex flex-col grow overflow-hidden">
            {completeOrderedQueue.length === 0 && (
                <span className="mt-4 text-xl text-slate-900/50 italic select-none">Queue is empty</span>
            )}
            {completeOrderedQueue.map(queuedMedia => (
                <QueuedMedia
                    key={`${queuedMedia.timeQueued}_${queuedMedia.userWhoQueued}_${queuedMedia.mediaId}`}
                    userId={userId}
                    media={queuedMedia}
                    onRemove={() =>
                        queuedMedia.origin === "server"
                            ? removeMediaFromServerQueue()
                            : removeMediaFromLocalQueue(queuedMedia)
                    }
                    origin={queuedMedia.origin}
                />
            ))}
        </div>
    )
}

export default QueuePanel
