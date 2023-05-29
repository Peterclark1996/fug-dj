package com.example.pojos

import com.example.state.Connection
import kotlinx.serialization.Serializable

data class RoomState(
    val id: String,
    val displayName: String,
    val connectedUsers: Set<Connection>,
    val queue: Set<QueuedMediaDto>
) {
    fun toDto(): RoomStateDto {
        return RoomStateDto(
            displayName = displayName,
            connectedUsers = connectedUsers.map { it.username }.toSet(),
            queue = queue
        )
    }
}

@Serializable
data class RoomStateDto(
    val displayName: String,
    val connectedUsers: Set<String>,
    val queue: Set<QueuedMediaDto>
)