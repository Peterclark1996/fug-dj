import PlaylistDto from "./PlaylistDto"

type UserDataDto = {
    id: string
    displayName: string
    playlists: PlaylistDto[]
}

export default UserDataDto
