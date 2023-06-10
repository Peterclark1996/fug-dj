package com.example.routes.room

import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.func.respondWith
import com.example.func.toEither
import com.example.state.ServerState
import io.ktor.server.application.*
import io.ktor.server.routing.*
import java.util.concurrent.atomic.AtomicReference

fun Route.getRoomById(mongoFunctions: MongoFunctions, serverState: AtomicReference<ServerState>) = get("/{roomId}") {
    val result = call.parameters["roomId"].toEither().flatMap { roomId ->
        mongoFunctions.getRoomByIdF(roomId).map { mongoRoomDto ->
            val roomState = serverState.get().rooms[call.parameters["roomId"]]
            roomState?.toDto() ?: mongoRoomDto.toDto()
        }
    }

    call.respondWith(result)
}