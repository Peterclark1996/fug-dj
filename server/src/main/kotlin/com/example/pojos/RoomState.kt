package com.example.pojos

import com.example.state.Connection
import kotlinx.serialization.Serializable

data class RoomState(
    val id: String,
    val displayName: String,
    val connectedUsers: Set<Connection>,
    val queue: Set<QueuedMediaDto>,
    val currentlyPlayingMedia: QueuedMediaDto?,
    val currentlyPlayingMediaStartedAt: String?
) {
    fun toDto() = RoomStateDto(
        displayName = displayName,
        connectedUsers = connectedUsers.map { it.username }.toSet(),
        queue = queue,
        currentlyPlayingMedia = currentlyPlayingMedia,
        currentlyPlayingMediaStartedAt = currentlyPlayingMediaStartedAt
    )
}

@Serializable
data class RoomStateDto(
    val displayName: String,
    val connectedUsers: Set<String>,
    val queue: Set<QueuedMediaDto>,
    val currentlyPlayingMedia: QueuedMediaDto?,
    val currentlyPlayingMediaStartedAt: String?
)