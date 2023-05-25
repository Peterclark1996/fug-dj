export type EventToServerType = "USER_SENT_MESSAGE"

export type EventToServer = EventToServer_UserSentMessage

export type EventToServer_UserSentMessage = {
    type: "USER_SENT_MESSAGE"
    data: {
        username: string
        message: string
    }
}
