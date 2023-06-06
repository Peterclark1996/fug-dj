import { useState } from "react"
import SavedMediaDto from "../../../dtos/SavedMediaDto"
import useApiMutation from "../../../hooks/useApiMutation"
import Button from "../../../library/Button"
import Input from "../../../library/Input"
import { useParams } from "react-router-dom"
import { secondsToTimeFormat } from "../helpers"

type MediaProps = {
    media: SavedMediaDto
    playlistId: string
    onMediaUpdated: () => void
}

const Media = ({ media, playlistId, onMediaUpdated }: MediaProps) => {
    const [isEditingName, setIsEditingName] = useState<boolean>(false)
    const [updatedName, setUpdatedName] = useState<string>(media.displayName)

    const updateMediaRequest = useApiMutation("patch", `playlist/${playlistId}/media/${media.mediaId}`)
    const onConfirmUpdateClick = () =>
        updateMediaRequest
            .execute({ displayName: updatedName })
            .then(onMediaUpdated)
            .then(() => setIsEditingName(false))
    const onCancelUpdateClick = () => {
        setUpdatedName(media.displayName)
        setIsEditingName(false)
    }

    const removeMediaRequest = useApiMutation("delete", `playlist/${playlistId}/media/${media.mediaId}`)
    const onRemoveClick = () => removeMediaRequest.execute().then(onMediaUpdated)

    const { roomId } = useParams()
    const queueMediaRequest = useApiMutation("post", `room/${roomId}/queue`)
    const onQueueClick = () =>
        queueMediaRequest.execute({
            playlistId: playlistId,
            mediaId: media.mediaId
        })

    return (
        <div className="flex grow items-center mt-2 rounded outline outline-1 outline-slate-800 form-emboss">
            <div className="cursor-move h-100 px-3 py-2 rounded outline outline-1 outline-slate-800">
                <i className="fa-solid fa-grip-lines fa-xl" />
            </div>
            <span className="ms-2">{secondsToTimeFormat(media.lengthInSeconds)}</span>
            <div className="flex grow items-center py-1 pe-1">
                {isEditingName ? (
                    <>
                        <Input className="ms-2" value={updatedName} onChange={setUpdatedName} />
                        <i
                            role="button"
                            className="ms-2 fa-solid fa-check text-green-400 fa-sm px-2 py-4"
                            onClick={onConfirmUpdateClick}
                        />
                        <i
                            role="button"
                            className="ms-1 fa-solid fa-times text-red-400 fa-sm px-2 py-4"
                            onClick={onCancelUpdateClick}
                        />
                    </>
                ) : (
                    <>
                        <span className="ms-2">{media.displayName.trim()}</span>
                        <i
                            role="button"
                            className="ms-2 fa-solid fa-pencil text-cyan-600 fa-sm px-2 py-4"
                            onClick={() => setIsEditingName(true)}
                        />
                    </>
                )}

                <Button className="ms-auto" icon="fa-play" colour="bg-cyan-600" text="Queue" onClick={onQueueClick} />
                <Button className="ms-2" icon="fa-trash" colour="bg-red-400" text="Remove" onClick={onRemoveClick} />
            </div>
        </div>
    )
}

export default Media
