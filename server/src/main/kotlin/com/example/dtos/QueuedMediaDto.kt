package com.example.dtos

import kotlinx.serialization.Serializable

@Serializable
data class QueuedMediaDto(
    val userWhoQueued: String,
    val timeQueued: String,
    val videoId: String
)