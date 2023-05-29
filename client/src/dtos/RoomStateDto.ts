import QueuedMediaDto from "./QueuedMediaDto"

type RoomStateDto = {
    displayName: string
    connectedUsers: string[]
    queue: QueuedMediaDto[]
}

export default RoomStateDto
