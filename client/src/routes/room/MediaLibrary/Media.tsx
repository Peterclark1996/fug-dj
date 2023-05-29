import { useUserMedia } from "../../../contexts/UserMediaContext"
import SavedMediaDto from "../../../dtos/SavedMediaDto"
import useApiMutation from "../../../hooks/useApiMutation"
import Button from "../../../library/Button"

type MediaProps = {
    media: SavedMediaDto
    playlistId: string
}

const Media = ({ media, playlistId }: MediaProps) => {
    const { fetchPlaylists } = useUserMedia()

    const removeMediaRequest = useApiMutation("delete", `playlist/${playlistId}/media/${media.mediaId}`)
    const onRemoveClick = () => removeMediaRequest.execute().then(fetchPlaylists)
    const onQueueClick = () => {
        return
    }

    return (
        <div className="flex grow mt-2 rounded outline outline-1 outline-slate-800 form-emboss">
            <div className="cursor-move h-100 px-3 py-2 rounded outline outline-1 outline-slate-800">
                <i className="fa-solid fa-grip-lines fa-xl" />
            </div>
            <div className="flex grow items-center p-1">
                <span className="ms-2 text-sm">{media.displayName.trim()}</span>
                <Button className="ms-auto" icon="fa-play" colour="bg-cyan-600" text="Queue" onClick={onQueueClick} />
                <Button className="ms-2" icon="fa-trash" colour="bg-red-400" text="Remove" onClick={onRemoveClick} />
            </div>
        </div>
    )
}

export default Media
