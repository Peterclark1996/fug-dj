package com.example.state

import com.example.pojos.QueuedMediaDto
import com.example.pojos.RoomStateDto

data class RoomState(
    val roomId: String,
    val displayName: String,
    val connectedUsers: Set<Connection>,
    val queue: Set<QueuedMediaDto>,
    val currentlyPlayingMedia: QueuedMediaDto?,
    val currentlyPlayingMediaStartedAt: String?,
    val owner: String,
    val visibility: String
) {
    fun toDto() = RoomStateDto(
        roomId = roomId,
        displayName = displayName,
        connectedUsers = connectedUsers.map { it.username }.toSet(),
        queue = queue,
        currentlyPlayingMedia = currentlyPlayingMedia,
        currentlyPlayingMediaStartedAt = currentlyPlayingMediaStartedAt,
        owner = owner,
        visibility = visibility
    )

    fun withAddedConnection(connection: Connection) = copy(
        connectedUsers = connectedUsers + connection
    )
}