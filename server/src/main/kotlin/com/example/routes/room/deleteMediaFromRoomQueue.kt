package com.example.routes.room

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.right
import com.example.events.outbound.OutboundRoomStateUpdated
import com.example.func.getUserId
import com.example.func.respondWith
import com.example.func.toEither
import com.example.state.ServerState
import com.example.state.getRoomById
import com.example.state.sendToConnectedUsers
import io.ktor.server.application.*
import io.ktor.server.routing.*
import java.util.concurrent.atomic.AtomicReference
import kotlin.collections.set

fun Route.deleteMediaFromRoomQueue(serverState: AtomicReference<ServerState>) =
    delete("/{roomId}/queue") {
        val response =
            call.getUserId().flatMap { userId ->
                call.parameters["roomId"].toEither().flatMap { roomId ->
                    updateRoomState(serverState, roomId, userId)
                }
            }

        call.respondWith(response)
    }

private suspend fun updateRoomState(
    serverState: AtomicReference<ServerState>,
    roomId: String,
    userId: String
): Either<Error, Unit> {
    var roomWasUpdated = false
    serverState.getAndUpdate { state ->
        val existingRoom = state.rooms[roomId]

        if (existingRoom != null && existingRoom.queue.any { it.userWhoQueued == userId }) {
            roomWasUpdated = true
            state.rooms[roomId] = existingRoom.copy(
                queue = existingRoom.queue.filter { it.userWhoQueued != userId }.toSet()
            )
        }

        state
    }

    return if (roomWasUpdated) {
        serverState.get().rooms[roomId].toEither().flatMap { updatedRoom ->
            serverState.getRoomById(roomId).flatMap { roomState ->
                roomState.sendToConnectedUsers(OutboundRoomStateUpdated(updatedRoom.toDto()))
            }
        }
    } else {
        Unit.right()
    }
}