package com.example.routes.room

import arrow.core.flatMap
import com.example.events.outbound.OutboundRoomStateUpdated
import com.example.func.parse
import com.example.func.toEither
import com.example.func.utcNow
import com.example.pojos.QueuedMediaDto
import com.example.state.ServerState
import com.example.state.mutateAtomically
import com.example.state.sendToRoom
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.coroutineScope
import kotlinx.serialization.Serializable
import java.util.concurrent.atomic.AtomicReference

@Serializable
data class PostNewMediaToRoomQueueDto(
    val videoId: String
)

fun Route.postNewMediaToRoomQueue(serverState: AtomicReference<ServerState>) = post("/{roomId}/queue") {
    val jsonBody = this.call.receiveText()
    coroutineScope {
        PostNewMediaToRoomQueueDto.serializer().parse(jsonBody).flatMap { dto ->
            call.parameters["roomId"].toEither().flatMap { roomId ->
                serverState.mutateAtomically { serverStateSafe ->
                    serverStateSafe.rooms[roomId].toEither("Failed to find room with id: '$roomId'").flatMap { room ->
                        val updatedRoom = room.copy(
                            queue = room.queue + QueuedMediaDto(
                                userWhoQueued = "pete",
                                timeQueued = utcNow(),
                                videoId = dto.videoId
                            )
                        )

                        serverStateSafe.rooms[roomId] = updatedRoom

                        serverState.sendToRoom(roomId, OutboundRoomStateUpdated(updatedRoom.toDto()))
                    }
                }
            }
        }.fold({ call.respond(HttpStatusCode.InternalServerError) }, { call.respond(HttpStatusCode.OK) })
    }
}