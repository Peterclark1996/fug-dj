import PlaylistDto from "./PlaylistDto"

type UserDataDto = {
    userId: string
    displayName: string
    playlists: PlaylistDto[]
}

export default UserDataDto
