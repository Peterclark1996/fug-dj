package com.example.routes.room

import com.example.func.utcNow
import com.example.pojos.QueuedMediaDto
import com.example.pojos.RoomStateDto
import com.example.respondWith
import io.ktor.server.application.*
import io.ktor.server.routing.*

fun Route.getRoomById() = get("/{roomId}") {
    val queuedMedia = listOf(
        QueuedMediaDto(
            userWhoQueued = "pete",
            timeQueued = utcNow(),
            mediaId = "1"
        ),
        QueuedMediaDto(
            userWhoQueued = "pete",
            timeQueued = utcNow(),
            mediaId = "2"
        ),
        QueuedMediaDto(
            userWhoQueued = "pete",
            timeQueued = utcNow(),
            mediaId = "3"
        )
    )

    val roomState = RoomStateDto(
        name = "Room ${call.parameters["roomId"]}",
        connectedUsers = listOf("pete"),
        queue = queuedMedia
    )

    call.respondWith(roomState)
}