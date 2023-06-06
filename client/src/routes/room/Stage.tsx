import QueuedMediaDto from "../../dtos/QueuedMediaDto"

type StageProps = {
    currentlyPlayingMedia: QueuedMediaDto | undefined
}

const Stage = ({ currentlyPlayingMedia }: StageProps) => {
    return (
        <div className="flex grow">
            <div className="flex flex-col mx-auto mt-4 p-4 h-40 w-50 bg-slate-600 ">
                <span>Youtube Player:</span>
                <span>{currentlyPlayingMedia?.displayName}</span>
            </div>
        </div>
    )
}

export default Stage
