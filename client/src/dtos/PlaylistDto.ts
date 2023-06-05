import SavedMediaDto from "./SavedMediaDto"

type PlaylistDto = {
    id: string
    displayName: string
    media?: SavedMediaDto[]
}

export default PlaylistDto
