package com.example.external.mongo

import com.example.pojos.PlaylistDto
import kotlinx.serialization.Serializable

@Serializable
data class MongoUserDataDto(
    val displayName: String,
    val playlists: List<PlaylistDto>
)