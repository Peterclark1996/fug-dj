package com.example.routes.room

import com.example.pojos.QueuedMediaDto
import com.example.pojos.RoomStateDto
import com.example.func.encode
import com.example.func.utcNow
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.getRoomById() = get("/{roomId}") {
    val queuedMedia = listOf(
        QueuedMediaDto(
            userWhoQueued = "pete",
            timeQueued = utcNow(),
            videoId = "1"
        ),
        QueuedMediaDto(
            userWhoQueued = "pete",
            timeQueued = utcNow(),
            videoId = "2"
        ),
        QueuedMediaDto(
            userWhoQueued = "pete",
            timeQueued = utcNow(),
            videoId = "3"
        )
    )

    val roomState = RoomStateDto(
        name = "Room ${call.parameters["roomId"]}",
        connectedUsers = listOf("pete"),
        queue = queuedMedia
    )

    val json = roomState.encode()

    json.fold({ call.respond(HttpStatusCode.InternalServerError) }, { call.respondText(it) })
}