package com.example.mongo

import com.example.pojos.PlaylistDto
import com.example.pojos.SavedMediaDto
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
class MongoUserDataDto (
    @SerialName("_id") val id: String,
    val displayName: String,
    val playlists: List<PlaylistDto>
)