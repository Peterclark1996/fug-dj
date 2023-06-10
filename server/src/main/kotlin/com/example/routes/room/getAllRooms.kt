package com.example.routes.room

import com.example.external.mongo.MongoFunctions
import com.example.func.respondWith
import com.example.state.ServerState
import io.ktor.server.application.*
import io.ktor.server.routing.*
import java.util.concurrent.atomic.AtomicReference

fun Route.getAllRooms(mongoFunctions: MongoFunctions, serverState: AtomicReference<ServerState>) = get {
    val result = mongoFunctions.getAllRoomsF().map { mongoRoomDtos ->
        mongoRoomDtos.map { mongoRoomDto ->
            val roomState = serverState.get().rooms[mongoRoomDto.id]
            roomState?.toDto() ?: mongoRoomDto.toDto()
        }
    }

    call.respondWith(result)
}