import QueuedMediaDto from "../routes/dtos/QueuedMediaDto"

export const EventFromServerType = {
    NEXT_MEDIA_STARTED: "NEXT_MEDIA_STARTED",
    USER_SENT_MESSAGE: "USER_SENT_MESSAGE"
} as const

export type EventFromServer = EventFromServer_NextMediaStarted | EventFromServer_UserSentMessage

export type EventFromServer_NextMediaStarted = {
    type: typeof EventFromServerType.NEXT_MEDIA_STARTED
    data: {
        nextMedia: QueuedMediaDto
    }
}

export type EventFromServer_UserSentMessage = {
    type: typeof EventFromServerType.USER_SENT_MESSAGE
    data: {
        username: string
        message: string
    }
}
