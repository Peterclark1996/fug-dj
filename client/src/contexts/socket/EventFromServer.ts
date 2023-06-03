import QueuedMediaDto from "../../dtos/QueuedMediaDto"
import RoomStateDto from "../../dtos/RoomStateDto"

export type EventFromServerType = "NEXT_MEDIA_STARTED" | "USER_SENT_MESSAGE" | "ROOM_STATE_UPDATED"

export type EventFromServer =
    | EventFromServer_NextMediaStarted
    | EventFromServer_UserSentMessage
    | EventFromServer_RoomStateUpdated

export type EventFromServer_NextMediaStarted = {
    type: "NEXT_MEDIA_STARTED"
    data: {
        queuedMedia: QueuedMediaDto
        timeStarted: string
    }
}

export type EventFromServer_UserSentMessage = {
    type: "USER_SENT_MESSAGE"
    data: {
        username: string
        message: string
    }
}

export type EventFromServer_RoomStateUpdated = {
    type: "ROOM_STATE_UPDATED"
    data: RoomStateDto
}
