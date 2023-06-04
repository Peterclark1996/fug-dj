package com.example.routes.room

import com.example.func.NotFoundError
import com.example.func.respondWith
import com.example.func.toEither
import com.example.state.ServerState
import io.ktor.server.application.*
import io.ktor.server.routing.*
import java.util.concurrent.atomic.AtomicReference

fun Route.getRoomById(serverState: AtomicReference<ServerState>) = get("/{roomId}") {
    val roomState = serverState.get().rooms[call.parameters["roomId"]]

    val result = roomState.toEither()
        .map { it.toDto() }
        .mapLeft { NotFoundError("Failed to find room with id: '${call.parameters["roomId"]}'") }

    call.respondWith(result)
}