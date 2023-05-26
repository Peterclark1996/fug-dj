package com.example.state

import arrow.core.Either
import arrow.core.left
import com.example.events.IOutboundEvent
import com.example.func.sendEvent
import com.example.func.toEither
import com.example.pojos.RoomState
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import java.util.*
import java.util.concurrent.atomic.AtomicReference

suspend inline fun <T> AtomicReference<ServerState>.mutateAtomically(
    crossinline mutateF: suspend (ServerState) -> Either<Error, T>
): Either<Error, T> {
    var result: Either<Error, T> = Error("Failed to modify atomically").left()
    coroutineScope {
        launch {
            result = mutateF(this@mutateAtomically.get())
        }
    }
    return result
}

suspend inline fun <reified TEvent : IOutboundEvent<TData>, reified TData> AtomicReference<ServerState>.sendToRoom(
    roomId: String,
    event: TEvent
): Either<Error, Unit> =
    this.get().rooms[roomId].toEither("Failed to find room with id: '${roomId}'").map { room ->
        room.connectedUsers.forEach { connection ->
            connection.session.sendEvent(event)
        }
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