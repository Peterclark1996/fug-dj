package com.example.pojos

import kotlinx.serialization.Serializable

@Serializable
data class PlaylistDto(
    val id: String,
    val displayName: String? = "Untitled playlist",
    val media: List<SavedMediaDto>? = listOf()
)