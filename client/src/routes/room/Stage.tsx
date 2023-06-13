import { useState } from "react"
import QueuedMediaDto from "../../dtos/QueuedMediaDto"
import YouTube, { YouTubePlayer, YouTubeProps } from "react-youtube"
import Slider from "../../library/Slider"
import moment from "moment"

type StageProps = {
    currentlyPlayingMedia: QueuedMediaDto | undefined
    currentlyPlayingStartTime: string | undefined
}

const Stage = ({ currentlyPlayingMedia, currentlyPlayingStartTime }: StageProps) => {
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(10)
    const [player, setPlayer] = useState<YouTubePlayer | undefined>(undefined)

    const onMuteToggle = () => {
        setIsMuted(current => !current)
        if (player) {
            if (isMuted) {
                player.unMute()
                player.setVolume(volume)
            } else {
                player.mute()
            }
        }
    }

    const onVolumeChange = (value: number) => {
        setVolume(value)
        if (player) {
            player.setVolume(value)
        }
    }

    const onPlayerReady: YouTubeProps["onReady"] = event => {
        const newPlayer = event.target
        newPlayer.setVolume(volume)

        if (currentlyPlayingMedia && currentlyPlayingStartTime) {
            const secondsSinceStarted = moment(Date.now()).diff(moment(currentlyPlayingStartTime), "seconds")
            newPlayer.seekTo(secondsSinceStarted, true)
        }

        setPlayer(newPlayer)
    }

    const onPause: YouTubeProps["onPause"] = event => {
        event.target.playVideo()
    }

    const opts: YouTubeProps["opts"] = {
        height: "390",
        width: "640",
        playerVars: {
            autoplay: 1,
            controls: 0
        }
    }

    return (
        <div className="flex flex-col grow">
            <div className="mx-auto">
                {currentlyPlayingMedia && (
                    <YouTube
                        videoId={currentlyPlayingMedia.mediaId.slice(1)}
                        opts={opts}
                        onReady={onPlayerReady}
                        onPause={onPause}
                    />
                )}
            </div>

            <div className="flex items-center rounded-t mt-auto mx-auto px-2 py-1 bg-slate-600 form-emboss z-10">
                <i
                    className={`fa-solid ${isMuted ? "fa-volume-xmark" : "fa-volume-high"} w-5 me-2`}
                    role="button"
                    onClick={onMuteToggle}
                />
                <Slider value={volume} onChange={onVolumeChange} />
            </div>
        </div>
    )
}

export default Stage
