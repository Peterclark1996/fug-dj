import moment from "moment"
import QueuedMediaDto from "../../../dtos/QueuedMediaDto"
import QueuedMedia from "./QueuedMedia"

type QueuePanelProps = {
    roomQueue: QueuedMediaDto[]
    userQueue: QueuedMediaDto[]
    removeMediaFromQueue: (mediaId: string) => void
}

const QueuePanel = ({ roomQueue, userQueue, removeMediaFromQueue }: QueuePanelProps) => {
    const orderedUserQueue = userQueue.sort((a, b) => moment(a.timeQueued).valueOf() - moment(b.timeQueued).valueOf())
    const completeOrderedQueue = [...roomQueue, ...orderedUserQueue.slice(1)].sort(
        (a, b) => moment(a.timeQueued).valueOf() - moment(b.timeQueued).valueOf()
    )

    return (
        <div className="flex flex-col grow overflow-hidden">
            {completeOrderedQueue.length === 0 && (
                <span className="mt-4 text-xl text-slate-900/50 italic select-none">Queue is empty</span>
            )}
            {completeOrderedQueue.map(queuedMedia => (
                <QueuedMedia
                    key={`${queuedMedia.userWhoQueued}_${queuedMedia.mediaId}_${queuedMedia.timeQueued}`}
                    media={queuedMedia}
                    onRemove={() => removeMediaFromQueue(queuedMedia.mediaId)}
                />
            ))}
        </div>
    )
}

export default QueuePanel
