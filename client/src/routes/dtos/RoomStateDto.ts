import QueuedMediaDto from "./QueuedMediaDto"

type RoomStateDto = {
    name: string
    connectedUsers: string[]
    queue: QueuedMediaDto[]
}

export default RoomStateDto
