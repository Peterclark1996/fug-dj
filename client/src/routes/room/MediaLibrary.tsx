import { useState } from "react"
import Input from "../../library/Input"
import Button from "../../library/Button"
import useApiMutation from "../../hooks/useApiMutation"
import { useUserMedia } from "../../contexts/UserMediaContext"

const MediaLibrary = () => {
    const { playlists } = useUserMedia()

    const [mediaToAdd, setMediaToAdd] = useState<string>("")

    const addNewMediaRequest = useApiMutation("post", "playlist/_default/media")

    const onAddClick = () => addNewMediaRequest.execute({ url: mediaToAdd })

    return (
        <div className="flex flex-col p-3">
            <span className="me-auto">Media Library</span>
            <div className="flex items-center">
                <Input placeholder="Enter URL" value={mediaToAdd} onChange={setMediaToAdd} />
                <Button className="ms-2" icon="fa-plus" text="Add" onClick={onAddClick} />
            </div>
            <div>
                {playlists.map(playlist => (
                    <div key={playlist.id} className="flex flex-col">
                        <span className="mt-2">{playlist.displayName}</span>
                        <div className="flex flex-col">
                            {playlist.media.map(media => (
                                <span key={media.mediaId} className="mt-2">
                                    {media.displayName}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MediaLibrary
