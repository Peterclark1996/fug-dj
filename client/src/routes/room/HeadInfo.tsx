import moment from "moment"
import QueuedMediaDto from "../../dtos/QueuedMediaDto"
import { secondsToTimeFormat } from "./helpers"

type HeadProps = {
    currentlyPlayingMedia: QueuedMediaDto | undefined
    currentlyPlayingStartTime: string | undefined
}

const HeadInfo = ({ currentlyPlayingMedia, currentlyPlayingStartTime }: HeadProps) => {
    const timePlaying = moment(currentlyPlayingStartTime).diff(Date.now(), "seconds")
    const timeLeft = currentlyPlayingMedia?.lengthInSeconds ?? 0

    const timeLeftFormatted = secondsToTimeFormat(timeLeft - timePlaying)

    return (
        <div className="flex grow">
            {currentlyPlayingMedia && (
                <>
                    <img
                        className="rounded outline outline-1 outline-slate-900 me-4"
                        src={currentlyPlayingMedia.thumbnailUrl}
                    />
                    <div className="flex grow flex-col">
                        <span className="flex grow items-center mx-auto">{currentlyPlayingMedia.displayName}</span>
                        <div className="h-1 bg-green-400" />
                    </div>
                    <span className="my-auto mx-4">{timeLeftFormatted}</span>
                </>
            )}
        </div>
    )
}

export default HeadInfo
