package com.example.pojos

import kotlinx.serialization.Serializable

@Serializable
data class UserDataDto(
    val userId: String,
    val displayName: String,
    val playlists: List<PlaylistDto>
)