package com.example.mongo

import com.example.pojos.PlaylistDto
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class MongoUserDataDto(
    @SerialName("_id") val id: String,
    val displayName: String,
    val playlists: List<PlaylistDto>
)