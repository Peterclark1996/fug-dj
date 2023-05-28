import SavedMediaDto from "../../../dtos/SavedMediaDto"

type MediaProps = {
    media: SavedMediaDto
    playlistId: string
}

const Media = ({ media, playlistId }: MediaProps) => {
    return (
        <div className="mt-2 ">
            <span className="text-sm">{media.displayName.trim()}</span>
        </div>
    )
}

export default Media
