import QueuedMediaDto from "../dtos/QueuedMediaDto"
import RoomStateDto from "../dtos/RoomStateDto"

export type EventFromServerType =
    | "CONNECTION_SUCCESS"
    | "NEXT_MEDIA_STARTED"
    | "USER_SENT_MESSAGE"
    | "ROOM_STATE_UPDATED"

export type EventFromServer =
    | EventFromServer_ConnectionSuccess
    | EventFromServer_NextMediaStarted
    | EventFromServer_UserSentMessage
    | EventFromServer_RoomStateUpdated

export type EventFromServer_ConnectionSuccess = {
    type: "CONNECTION_SUCCESS"
    data: {
        message: string
    }
}

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
        source: "USER" | "SYSTEM"
        userId: string | undefined
        username: string
        message: string
        timestamp: string
    }
}

export type EventFromServer_RoomStateUpdated = {
    type: "ROOM_STATE_UPDATED"
    data: RoomStateDto
}
