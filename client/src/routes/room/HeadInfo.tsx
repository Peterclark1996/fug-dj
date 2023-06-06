import moment from "moment"
import QueuedMediaDto from "../../dtos/QueuedMediaDto"
import { secondsToTimeFormat } from "./helpers"
import { useEffect, useState } from "react"
import classes from "./HeadInfo.module.scss"

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
                        <div className="flex h-1 bg-slate-400">
                            <div className="h-1 bg-green-400" style={{ width: `${percentageComplete}%` }} />
                            <div className="h-1 relative">
                                <div className={`absolute bg-slate-300 ${classes.timeLeftIndicator}`} />
                            </div>
                        </div>
                    </div>
                    <span className="my-auto mx-4">{timeLeftFormatted}</span>
                </>
            )}
        </div>
    )
}

export default HeadInfo
