import { useState } from "react"
import Input from "../../../library/Input"
import Button from "../../../library/Button"
import useApiMutation from "../../../hooks/useApiMutation"
import Playlist from "./Playlist"
import useApiQuery from "../../../hooks/useApiQuery"
import PlaylistDto from "../../../dtos/PlaylistDto"
import Loading from "../../../library/Loading"
import SavedMediaDto from "../../../dtos/SavedMediaDto"

type MediaLibraryProps = {
    onClose: () => void
    addMediaToQueue: (media: SavedMediaDto, playlistId: string) => void
}

const MediaLibrary = ({ onClose, addMediaToQueue }: MediaLibraryProps) => {
    const [search, setSearch] = useState<string>("")
    const [mediaToAdd, setMediaToAdd] = useState<string>("")

    const addNewMediaRequest = useApiMutation("post", "playlist/_default/media")

    const userPlaylistsRequest = useApiQuery<PlaylistDto[]>(`playlist`)
    const playlists = userPlaylistsRequest.data ?? []

    const onAddClick = () => addNewMediaRequest.execute({ url: mediaToAdd }).then(userPlaylistsRequest.execute)

    const playlistsToShow =
        search === ""
            ? playlists
            : playlists.map(playlist => ({
                  ...playlist,
                  media: (playlist.media ?? []).filter(media =>
                      media.displayName.toLowerCase().includes(search.toLowerCase())
                  )
              }))

    return (
        <div className="flex flex-col grow m-3">
            <Loading isLoading={userPlaylistsRequest.isLoading}>
                <>
                    <div className="flex items-center mb-2 p-2 rounded bg-slate-600 form-emboss outline outline-1 outline-slate-800">
                        <span className="text-3xl">Media Library</span>
                        <Input className="ms-2" placeholder="Quick Search" value={search} onChange={setSearch} />
                        <Input
                            className="ms-2"
                            placeholder="Add Video From URL"
                            value={mediaToAdd}
                            onChange={setMediaToAdd}
                        />
                        <Button className="ms-2" icon="fa-plus" text="Add" colour="bg-green-400" onClick={onAddClick} />
                        <Button className="ms-auto" icon="fa-times" colour="bg-slate-400" onClick={onClose} />
                    </div>
                    <div>
                        {playlistsToShow.map(playlist => (
                            <Playlist
                                key={playlist.id}
                                playlist={playlist}
                                onMediaUpdated={userPlaylistsRequest.execute}
                                addMediaToQueue={addMediaToQueue}
                            />
                        ))}
                    </div>
                </>
            </Loading>
        </div>
    )
}

export default MediaLibrary
