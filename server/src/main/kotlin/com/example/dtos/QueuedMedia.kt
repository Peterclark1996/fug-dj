package com.example.dtos

import kotlinx.serialization.Serializable

@Serializable
data class QueuedMedia(
    val userWhoQueued: String,
    val timeQueued: String,
    val videoId: String
)