import QueuedMediaDto from "../../../dtos/QueuedMediaDto"
import { secondsToTimeFormat } from "../helpers"
import classes from "./QueuedMedia.module.scss"

type QueuedMediaProps = {
    media: QueuedMediaDto
    onRemove: () => void
}

const QueuedMedia = ({ media, onRemove }: QueuedMediaProps) => {
    return (
        <div
            className={`${classes.outlinedText} flex flex-col relative rounded mx-2 mt-2 px-3 py-2 form-emboss outline outline-1 outline-slate-900 font-extrabold`}
        >
            <div className="flex items-start mb-1 z-10">
                <span className="rounded bg-slate-900/25 px-2 line-clamp-2">{media.displayName}</span>
            </div>
            <div className="flex grow justify-between z-10">
                <span className="rounded bg-slate-900/25 px-2 me-1 truncate">
                    <i className="fa-solid fa-user me-2" />
                    {media.userWhoQueued}
                </span>
                <span className="flex items-center rounded bg-slate-900/25 px-2">
                    <i className="fa-solid fa-clock me-2" />
                    {secondsToTimeFormat(media.lengthInSeconds)}
                </span>
            </div>
            <div
                className="absolute bg-cover bg-center rounded inset-0 z-0"
                style={{
                    backgroundImage: `url("${media.thumbnailUrl}")`
                }}
            />
        </div>
    )
}

export default QueuedMedia
