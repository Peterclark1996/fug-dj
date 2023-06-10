import QueuedMediaDto from "./QueuedMediaDto"

type RoomStateDto = {
    roomId: string
    displayName: string
    owner: string
    visibility: "public" | "unlisted"
    connectedUsers: string[]
    queue: QueuedMediaDto[]
    currentlyPlayingMedia: QueuedMediaDto | undefined
    currentlyPlayingMediaStartedAt: string | undefined
}

export default RoomStateDto
