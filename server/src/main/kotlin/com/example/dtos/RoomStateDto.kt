package com.example.dtos

import kotlinx.serialization.Serializable

@Serializable
data class RoomStateDto(
    val name: String,
    val connectedUsers: List<String>,
    val queue: List<QueuedMediaDto>
)