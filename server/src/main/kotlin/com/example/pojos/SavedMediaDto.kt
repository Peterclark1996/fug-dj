package com.example.pojos

import kotlinx.serialization.Serializable

@Serializable
data class SavedMediaDto(
    val mediaId: String,
    val displayName: String,
    val thumbnailUrl: String,
    val lengthInSeconds: Int
)