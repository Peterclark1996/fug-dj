package com.example.external.mongo

import com.example.pojos.RoomStateDto
import com.example.state.RoomState
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable


@Serializable
data class MongoRoomDto(
    @SerialName("_id") val id: String,
    val displayName: String,
    val owner: String,
    val visibility: String
) {
    fun toDto() = RoomStateDto(
        roomId = id,
        displayName = displayName,
        connectedUsers = emptySet(),
        queue = emptySet(),
        currentlyPlayingMedia = null,
        currentlyPlayingMediaStartedAt = null,
        owner = owner,
        visibility = visibility
    )

    fun initialiseAsState() = RoomState(
        roomId = id,
        displayName = displayName,
        connectedUsers = emptySet(),
        queue = emptySet(),
        currentlyPlayingMedia = null,
        currentlyPlayingMediaStartedAt = null,
        owner = owner,
        visibility = visibility
    )
}