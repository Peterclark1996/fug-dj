package com.example.state

import arrow.core.Either
import arrow.core.flatMap
import arrow.core.right
import arrow.core.traverseEither
import com.example.events.IOutboundEvent
import com.example.func.mapToUnit
import com.example.func.sendEvent
import com.example.func.toEither
import com.example.pojos.RoomState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import java.util.*
import java.util.concurrent.atomic.AtomicReference

suspend inline fun <reified TEvent : IOutboundEvent<TData>, reified TData> AtomicReference<ServerState>.sendToRoom(
    roomId: String,
    event: TEvent
): Either<Error, Unit> =
    this.get().rooms[roomId].toEither("Failed to find room with id: '${roomId}'").flatMap { room ->
        room.connectedUsers.traverseEither { connection ->
            val session = connection.session
            if (session.closeReason.isActive) {
                session.sendEvent(event)
            } else {
                Unit.right()
            }
        }.mapToUnit()
    }

data class ServerState(
    var connections: Set<Connection> = Collections.synchronizedSet(LinkedHashSet()),
    val rooms: MutableMap<String, RoomState> = Collections.synchronizedMap(LinkedHashMap())
) {
    private var isRunning = false

    fun start() {
        isRunning = true
        CoroutineScope(Job()).launch {
            while (isRunning) {
                // TODO Check currently playing media, if any have ended, broadcast the next media to every room
            }
        }
    }
}