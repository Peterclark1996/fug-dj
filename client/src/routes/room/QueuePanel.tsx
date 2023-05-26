import QueuedMediaDto from "../../dtos/QueuedMediaDto"

type QueuePanelProps = {
    queue: QueuedMediaDto[]
}

const QueuePanel = ({ queue }: QueuePanelProps) => {
    return (
        <div className="flex flex-col">
            {queue.map(queuedMedia => (
                <span>{queuedMedia.videoId}</span>
            ))}
        </div>
    )
}

export default QueuePanel
