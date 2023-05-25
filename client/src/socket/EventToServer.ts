export const EventToServerType = {
    USER_SENT_MESSAGE: "USER_SENT_MESSAGE"
} as const

export type EventToServer = EventToServer_UserSentMessage

export type EventToServer_UserSentMessage = {
    type: typeof EventToServerType.USER_SENT_MESSAGE
    data: {
        username: string
        message: string
    }
}
