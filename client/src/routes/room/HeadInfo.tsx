import moment from "moment"
import QueuedMediaDto from "../../dtos/QueuedMediaDto"
import { secondsToTimeFormat } from "./helpers"
import { useEffect, useState } from "react"
import Slider from "../../library/Slider"

type HeadProps = {
    currentlyPlayingMedia: QueuedMediaDto | undefined
    currentlyPlayingStartTime: string | undefined
}

const HeadInfo = ({ currentlyPlayingMedia, currentlyPlayingStartTime }: HeadProps) => {
    const finishTime = moment(currentlyPlayingStartTime).add(currentlyPlayingMedia?.lengthInSeconds, "seconds")

    const [millisLeft, setMillisLeft] = useState(currentlyPlayingMedia?.lengthInSeconds ?? 0)

    const timeLeftFormatted = secondsToTimeFormat(millisLeft / 1000)

    useEffect(() => {
        if (!currentlyPlayingMedia || !currentlyPlayingStartTime) return

        const interval = setInterval(() => {
            const updatedTimeLeft = finishTime.diff(moment(Date.now()), "milliseconds")
            setMillisLeft(updatedTimeLeft < 0 ? 0 : updatedTimeLeft)
        }, 0)

        return () => clearInterval(interval)
    }, [currentlyPlayingMedia, currentlyPlayingStartTime, finishTime])

    const percentageComplete = 100 - (millisLeft / 1000 / (currentlyPlayingMedia?.lengthInSeconds ?? 1)) * 100

    return (
        <div className="flex grow">
            {currentlyPlayingMedia && (
                <>
                    <img className="border-1 border-slate-900" src={currentlyPlayingMedia.thumbnailUrl} />
                    <div className="flex grow flex-col">
                        <span className="flex grow items-center mx-auto">{currentlyPlayingMedia.displayName}</span>
                        <Slider value={percentageComplete} />
                    </div>
                    <span className="my-auto mx-4">{timeLeftFormatted}</span>
                </>
            )}
        </div>
    )
}

export default HeadInfo
