package com.example.routes.room

import arrow.core.flatMap
import com.example.events.outbound.OutboundRoomStateUpdated
import com.example.func.parse
import com.example.func.toEither
import com.example.func.utcNow
import com.example.pojos.QueuedMediaDto
import com.example.respondWith
import com.example.state.ServerState
import com.example.state.mutateAtomically
import com.example.state.sendToRoom
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.routing.*
import kotlinx.coroutines.coroutineScope
import kotlinx.serialization.Serializable
import java.util.concurrent.atomic.AtomicReference
import kotlin.collections.plus
import kotlin.collections.set

@Serializable
private data class PostNewMediaToRoomQueueDto(
    val mediaId: String
)

fun Route.postNewMediaToRoomQueue(serverState: AtomicReference<ServerState>) = post("/{roomId}/queue") {
    val jsonBody = this.call.receiveText()
    coroutineScope {
        val response = PostNewMediaToRoomQueueDto.serializer().parse(jsonBody, true).flatMap { dto ->
            call.parameters["roomId"].toEither().flatMap { roomId ->
                serverState.mutateAtomically { serverStateSafe ->
                    serverStateSafe.rooms[roomId].toEither("Failed to find room with id: '$roomId'").flatMap { room ->
                        val updatedRoom = room.copy(
                            queue = room.queue + QueuedMediaDto(
                                userWhoQueued = "pete",
                                timeQueued = utcNow(),
                                mediaId = dto.mediaId
                            )
                        )

                        serverStateSafe.rooms[roomId] = updatedRoom

                        serverState.sendToRoom(roomId, OutboundRoomStateUpdated(updatedRoom.toDto()))
                    }
                }
            }
        }

        call.respondWith(response)
    }
}