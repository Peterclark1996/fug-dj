import PlaylistDto from "../../../dtos/PlaylistDto"
import SavedMediaDto from "../../../dtos/SavedMediaDto"
import Media from "./Media"

type PlaylistProps = {
    playlist: PlaylistDto
    onMediaUpdated: () => void
    addMediaToQueue: (media: SavedMediaDto, playlistId: string) => void
}

const Playlist = ({ playlist, onMediaUpdated, addMediaToQueue }: PlaylistProps) => {
    return (
        <div className="flex flex-col mb-2 p-3 rounded bg-slate-600 form-emboss outline outline-1 outline-slate-800">
            <span className="me-auto text-2xl">{playlist.displayName}</span>
            <div className="m-2 h-px bg-slate-500" />
            <div className="flex flex-col">
                {(playlist.media ?? []).map(media => (
                    <Media
                        key={media.mediaId}
                        media={media}
                        playlistId={playlist.id}
                        onMediaUpdated={onMediaUpdated}
                        addMediaToQueue={addMediaToQueue}
                    />
                ))}
            </div>
        </div>
    )
}

export default Playlist
