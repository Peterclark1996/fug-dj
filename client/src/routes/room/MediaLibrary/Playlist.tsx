import PlaylistDto from "../../../dtos/PlaylistDto"
import Media from "./Media"

type PlaylistProps = {
    playlist: PlaylistDto
}

const Playlist = ({ playlist }: PlaylistProps) => {
    return (
        <div className="flex flex-col mb-2 p-2 rounded bg-slate-600 form-emboss">
            <span className="me-auto">{playlist.displayName}</span>
            <div className="m-2 h-px bg-slate-500" />
            <div className="flex flex-col items-start">
                {playlist.media.map(media => (
                    <Media key={media.mediaId} media={media} playlistId={playlist.id} />
                ))}
            </div>
        </div>
    )
}

export default Playlist
