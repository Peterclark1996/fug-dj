import { useState } from "react"
import Input from "../../../library/Input"
import Button from "../../../library/Button"
import useApiMutation from "../../../hooks/useApiMutation"
import { useUserMedia } from "../../../contexts/UserMediaContext"
import Playlist from "./Playlist"

type MediaLibraryProps = {
    onClose: () => void
}

const MediaLibrary = ({ onClose }: MediaLibraryProps) => {
    const { playlists } = useUserMedia()

    const [search, setSearch] = useState<string>("")
    const [mediaToAdd, setMediaToAdd] = useState<string>("")

    const addNewMediaRequest = useApiMutation("post", "playlist/_default/media")

    const onAddClick = () => addNewMediaRequest.execute({ url: mediaToAdd })

    const playlistsToShow =
        search === ""
            ? playlists
            : playlists.map(playlist => ({
                  ...playlist,
                  media: playlist.media.filter(media => media.displayName.toLowerCase().includes(search.toLowerCase()))
              }))

    return (
        <div className="flex flex-col grow m-3">
            <div className="flex items-center mb-2 p-2 rounded bg-slate-600 form-emboss">
                <span className="text-3xl">Media Library</span>
                <Input className="ms-2" placeholder="Quick Search" value={search} onChange={setSearch} />
                <Input
                    className="ms-2"
                    placeholder="Add Video From\\\\\\\\ URL"
                    value={mediaToAdd}
                    onChange={setMediaToAdd}
                />
                <Button className="ms-2" icon="fa-plus" text="Add" colour="bg-green-400" onClick={onAddClick} />
                <Button className="ms-auto" icon="fa-times" colour="bg-slate-400" onClick={onClose} />
            </div>
            <div>
                {playlistsToShow.map(playlist => (
                    <Playlist key={playlist.id} playlist={playlist} />
                ))}
            </div>
        </div>
    )
}

export default MediaLibrary
