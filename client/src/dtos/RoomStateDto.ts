import QueuedMediaDto from "./QueuedMediaDto"

type RoomStateDto = {
    displayName: string
    connectedUsers: string[]
    queue: QueuedMediaDto[]
    currentlyPlayingMedia: QueuedMediaDto | null
    currentlyPlayingMediaStartedAt: string | null
}

export default RoomStateDto
