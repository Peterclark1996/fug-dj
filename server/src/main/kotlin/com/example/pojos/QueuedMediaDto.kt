package com.example.pojos

import kotlinx.serialization.Serializable

@Serializable
data class QueuedMediaDto(
    val mediaId: String,
    val userWhoQueued: String,
    val timeQueued: String,
    val displayName: String,
    val thumbnailUrl: String,
    val lengthInSeconds: Int
)