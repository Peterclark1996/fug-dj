import QueuedMediaDto from "../../dtos/QueuedMediaDto"
import classes from "./QueuePanel.module.scss"
import { secondsToTimeFormat } from "./helpers"

type QueuePanelProps = {
    queue: QueuedMediaDto[]
}

const QueuePanel = ({ queue }: QueuePanelProps) => {
    return (
        <div className="flex flex-col grow overflow-hidden">
            {queue.length === 0 && (
                <span className="mt-4 text-xl text-slate-900/50 italic select-none">Queue is empty</span>
            )}
            {queue.map(queuedMedia => (
                <div
                    key={`${queuedMedia.userWhoQueued}_${queuedMedia.mediaId}`}
                    className={`${classes.outlinedText} flex flex-col relative rounded mx-2 mt-2 px-3 py-2 form-emboss outline outline-1 outline-slate-900 font-extrabold`}
                >
                    <div className="flex items-start mb-1 z-10">
                        <span className="rounded bg-slate-900/25 px-2 line-clamp-2">{queuedMedia.displayName}</span>
                    </div>
                    <div className="flex grow justify-between z-10">
                        <span className="rounded bg-slate-900/25 px-2 me-1 truncate">
                            <i className="fa-solid fa-user me-2" />
                            {queuedMedia.userWhoQueued}
                        </span>
                        <span className="flex items-center rounded bg-slate-900/25 px-2">
                            <i className="fa-solid fa-clock me-2" />
                            {secondsToTimeFormat(queuedMedia.lengthInSeconds)}
                        </span>
                    </div>
                    <div
                        className="absolute bg-cover bg-center rounded inset-0 z-0"
                        style={{
                            backgroundImage: `url("${queuedMedia.thumbnailUrl}")`
                        }}
                    />
                </div>
            ))}
        </div>
    )
}

export default QueuePanel
