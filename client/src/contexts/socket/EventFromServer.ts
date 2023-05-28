import QueuedMediaDto from "../../dtos/QueuedMediaDto"

export type EventFromServerType = "NEXT_MEDIA_STARTED" | "USER_SENT_MESSAGE"

export type EventFromServer = EventFromServer_NextMediaStarted | EventFromServer_UserSentMessage

export type EventFromServer_NextMediaStarted = {
    type: "NEXT_MEDIA_STARTED"
    data: {
        nextMedia: QueuedMediaDto
    }
}

export type EventFromServer_UserSentMessage = {
    type: "USER_SENT_MESSAGE"
    data: {
        username: string
        message: string
    }
}
