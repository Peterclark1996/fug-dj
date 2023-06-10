import QueuedMediaDto from "../../../dtos/QueuedMediaDto"
import Button from "../../../library/Button"
import { secondsToTimeFormat } from "../helpers"
import classes from "./QueuedMedia.module.scss"

type QueuedMediaProps = {
    userId: string
    media: QueuedMediaDto
    onRemove: () => void
}

const QueuedMedia = ({ userId, media, onRemove }: QueuedMediaProps) => {
    const queuedByCurrectUser = media.userWhoQueued === userId

    return (
        <div
            className={`${classes.outlinedText} 
            flex flex-col relative rounded mx-2 mt-2 p-2 form-emboss font-extrabold`}
        >
            <div className="flex items-start mb-1 z-10">
                <span className="rounded bg-slate-900/25 px-2 line-clamp-2">{media.displayName}</span>
                {queuedByCurrectUser && (
                    <Button className="ms-2" icon="fa-times" colour="bg-slate-400" onClick={onRemove} />
                )}
            </div>
            <div className="flex grow justify-between z-10">
                <span className="rounded bg-slate-900/25 px-2 me-1 truncate">
                    <i className="fa-solid fa-user me-2" />
                    {queuedByCurrectUser ? "You" : media.userWhoQueued}
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
