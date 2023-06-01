package com.example.routes.room

import arrow.core.flatMap
import com.example.TEMP_USER_ID
import com.example.events.outbound.OutboundRoomStateUpdated
import com.example.external.mongo.MongoFunctions
import com.example.func.parse
import com.example.func.toEither
import com.example.func.utcNow
import com.example.pojos.QueuedMediaDto
import com.example.respondWith
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
            PostNewMediaToRoomQueueDto.serializer().parse(jsonBody, true).flatMap { dto ->
                mongoFunctions.getAllPlaylistsF(TEMP_USER_ID).flatMap { playlists ->
                    playlists.find { it.id == dto.playlistId }?.media?.find { it.mediaId == dto.mediaId }.toEither()
                        .flatMap { savedMediaDto ->
                            call.parameters["roomId"].toEither().flatMap { roomId ->
                                serverState.getAndUpdate { state ->
                                    val existingRoom = state.rooms[roomId]

                                    if (existingRoom != null) {
                                        val usersPlaceInQueue =
                                            existingRoom.queue.find { it.userWhoQueued == TEMP_USER_ID }?.timeQueued

                                        val updatedRoom = existingRoom.copy(
                                            queue = existingRoom.queue.filter { it.userWhoQueued != TEMP_USER_ID }
                                                .toSet() + QueuedMediaDto(
                                                mediaId = savedMediaDto.mediaId,
                                                userWhoQueued = TEMP_USER_ID,
                                                timeQueued = usersPlaceInQueue ?: utcNow(),
                                                displayName = savedMediaDto.displayName,
                                                thumbnailUrl = savedMediaDto.thumbnailUrl,
                                                lengthInSeconds = savedMediaDto.lengthInSeconds
                                            )
                                        )
                                        state.rooms[roomId] = updatedRoom
                                    }

                                    state
                                }

                                serverState.get().rooms[roomId].toEither().flatMap { updatedRoom ->
                                    serverState.sendToRoom(
                                        roomId,
                                        OutboundRoomStateUpdated(updatedRoom.toDto())
                                    )
                                }
                            }
                        }
                }
            }

        call.respondWith(response)
    }