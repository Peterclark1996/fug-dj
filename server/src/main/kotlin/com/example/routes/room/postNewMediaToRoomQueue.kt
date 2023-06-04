package com.example.routes.room

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.right
import com.example.events.outbound.NextMediaStarted
import com.example.events.outbound.OutboundNextMediaStarted
import com.example.events.outbound.OutboundRoomStateUpdated
import com.example.external.mongo.MongoFunctions
import com.example.func.*
import com.example.pojos.QueuedMediaDto
import com.example.pojos.SavedMediaDto
import com.example.state.ServerState
import com.example.state.sendToRoom
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.serialization.Serializable
import java.util.concurrent.atomic.AtomicReference
import kotlin.collections.set

@Serializable
private data class PostNewMediaToRoomQueueDto(
    val playlistId: String,
    val mediaId: String
)

fun Route.postNewMediaToRoomQueue(mongoFunctions: MongoFunctions, serverState: AtomicReference<ServerState>) =
    post("/{roomId}/queue") {
        val jsonBody = this.call.receiveText()

        val response =
            call.getUserId().flatMap { userId ->
                PostNewMediaToRoomQueueDto.serializer().parse(jsonBody, true).flatMap { dto ->
                    mongoFunctions.getAllPlaylistsF(userId).flatMap { playlists ->
                        playlists.find { it.id == dto.playlistId }?.media?.find { it.mediaId == dto.mediaId }.toEither()
                            .flatMap { savedMediaDto ->
                                call.parameters["roomId"].toEither().flatMap { roomId ->
                                    updateRoomState(serverState, savedMediaDto, roomId, userId)
                                }
                            }
                    }
                }
            }

        call.respondWith(response)
    }

private suspend fun updateRoomState(
    serverState: AtomicReference<ServerState>,
    savedMediaDto: SavedMediaDto,
    roomId: String,
    userId: String
): Either<Error, Unit> {
    val queuedMedia = QueuedMediaDto(
        mediaId = savedMediaDto.mediaId,
        userWhoQueued = userId,
        timeQueued = utcNow(),
        displayName = savedMediaDto.displayName,
        thumbnailUrl = savedMediaDto.thumbnailUrl,
        lengthInSeconds = savedMediaDto.lengthInSeconds
    )

    var queuedMediaImmediatelyStarted = false
    serverState.getAndUpdate { state ->
        val existingRoom = state.rooms[roomId]

        if (existingRoom != null) {
            val updatedRoom =
                if (existingRoom.currentlyPlayingMedia == null && existingRoom.queue.isEmpty()) {
                    queuedMediaImmediatelyStarted = true
                    existingRoom.copy(
                        currentlyPlayingMedia = queuedMedia,
                        currentlyPlayingMediaStartedAt = utcNow()
                    )
                } else {
                    existingRoom.copy(
                        queue = existingRoom.queue.filter { it.userWhoQueued != userId }
                            .toSet() + queuedMedia.copy(
                            timeQueued = existingRoom.queue.find { it.userWhoQueued == userId }?.timeQueued
                                ?: utcNow(),
                        )
                    )
                }

            state.rooms[roomId] = updatedRoom
        }

        state
    }

    return serverState.get().rooms[roomId].toEither().flatMap { updatedRoom ->
        serverState.sendToRoom(
            roomId,
            OutboundRoomStateUpdated(updatedRoom.toDto())
        )
    }.flatMap {
        if (queuedMediaImmediatelyStarted) {
            serverState.sendToRoom(
                roomId,
                OutboundNextMediaStarted(NextMediaStarted(queuedMedia, utcNow()))
            )
        } else {
            Unit.right()
        }
    }
}