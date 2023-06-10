package com.example.pojos

import kotlinx.serialization.Serializable

@Serializable
data class RoomStateDto(
    val roomId: String,
    val displayName: String,
    val connectedUsers: Set<String>,
    val queue: Set<QueuedMediaDto>,
    val currentlyPlayingMedia: QueuedMediaDto?,
    val currentlyPlayingMediaStartedAt: String?,
    val owner: String,
    val visibility: String
)