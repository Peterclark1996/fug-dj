package com.example.pojos

import kotlinx.serialization.Serializable

@Serializable
class PlaylistDto (
    val id: String,
    val displayName: String,
    val media: List<SavedMediaDto>
)