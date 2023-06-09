import moment from "moment"
import QueuedMediaDto from "../../../dtos/QueuedMediaDto"
import QueuedMedia from "./QueuedMedia"

type QueuePanelProps = {
    roomQueue: QueuedMediaDto[]
    userQueue: QueuedMediaDto[]
    removeMediaFromQueue: (media: QueuedMediaDto) => void
}

const QueuePanel = ({ roomQueue, userQueue, removeMediaFromQueue }: QueuePanelProps) => {
    const orderedUserQueue = userQueue.sort((a, b) => moment(a.timeQueued).valueOf() - moment(b.timeQueued).valueOf())
    const firstInUserQueue = orderedUserQueue.length > 0 ? orderedUserQueue[0] : undefined

    const overlayedRoomQueue =
        firstInUserQueue === undefined ? roomQueue : getQueueWithLocalTimeOverlayed(roomQueue, firstInUserQueue)

    const orderedRoomQueue = overlayedRoomQueue.sort(
        (a, b) => moment(a.timeQueued).valueOf() - moment(b.timeQueued).valueOf()
    )

    const completeOrderedQueue: (QueuedMediaDto & { origin: "server" | "client" })[] = [
        ...orderedRoomQueue.map(m => ({ ...m, origin: "server" as const })),
        ...orderedUserQueue.slice(1).map(m => ({ ...m, origin: "client" as const }))
    ].sort((a, b) => moment(a.timeQueued).valueOf() - moment(b.timeQueued).valueOf())

    return (
        <div className="flex flex-col grow overflow-hidden">
            {completeOrderedQueue.length === 0 && (
                <span className="mt-4 text-xl text-slate-900/50 italic select-none">Queue is empty</span>
            )}
            {completeOrderedQueue.map(queuedMedia => (
                <QueuedMedia
                    key={`${queuedMedia.timeQueued}_${queuedMedia.userWhoQueued}_${queuedMedia.mediaId}`}
                    media={queuedMedia}
                    onRemove={() => removeMediaFromQueue(queuedMedia)}
                    origin={queuedMedia.origin}
                />
            ))}
        </div>
    )
}

export default QueuePanel

const getQueueWithLocalTimeOverlayed = (
    roomQueue: QueuedMediaDto[],
    firstInUserQueue: QueuedMediaDto
): QueuedMediaDto[] => {
    const doesQueueContainUserMedia = roomQueue.some(
        queuedMedia =>
            queuedMedia.mediaId === firstInUserQueue.mediaId &&
            queuedMedia.userWhoQueued === firstInUserQueue.userWhoQueued
    )

    if (!doesQueueContainUserMedia) {
        return [...roomQueue, firstInUserQueue]
    }

    return roomQueue.map(queuedMedia => {
        if (
            queuedMedia.mediaId === firstInUserQueue.mediaId &&
            queuedMedia.userWhoQueued === firstInUserQueue.userWhoQueued
        ) {
            return {
                ...queuedMedia,
                timeQueued: firstInUserQueue.timeQueued
            }
        }

        return queuedMedia
    })
}
