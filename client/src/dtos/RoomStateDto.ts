import QueuedMediaDto from "./QueuedMediaDto"

type RoomStateDto = {
    displayName: string
    connectedUsers: string[]
    queue: QueuedMediaDto[]
    currentlyPlayingMedia: QueuedMediaDto | undefined
    currentlyPlayingMediaStartedAt: string | undefined
}

export default RoomStateDto
