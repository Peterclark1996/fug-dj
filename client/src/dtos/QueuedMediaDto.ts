type QueuedMediaDto = {
    mediaId: string
    userWhoQueued: string
    timeQueued: string
    displayName: string
    thumbnailUrl: string
    lengthInSeconds: number
}

export default QueuedMediaDto
