package com.example.pojos

import com.example.state.Connection
import kotlinx.serialization.Serializable

data class RoomState(
    val id: String,
    val name: String,
    val connectedUsers: Set<Connection>,
    val queue: Set<QueuedMediaDto>
) {
    fun toDto(): RoomStateDto {
        return RoomStateDto(
            name = name,
            connectedUsers = connectedUsers.map { it.username },
            queue = queue.toList()
        )
    }
}

@Serializable
data class RoomStateDto(
    val name: String,
    val connectedUsers: List<String>,
    val queue: List<QueuedMediaDto>
)