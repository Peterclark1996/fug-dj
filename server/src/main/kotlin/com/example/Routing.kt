package com.example

import arrow.core.left
import arrow.core.right
import com.example.dtos.QueuedMediaDto
import com.example.dtos.RoomStateDto
import com.example.func.encode
import com.example.func.utcNow
import com.example.state.ServerState
import io.ktor.http.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.util.Identity.encode
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.util.concurrent.atomic.AtomicReference

fun Application.configureRouting(serverState: AtomicReference<ServerState>) {
    routing {
        static("/") {
            staticRootFolder = File("client")

            file("index.html")
            default("index.html")

            static("assets") {
                files(".")
            }
        }

        route("/api") {
            route("/room") {
                route("/{roomId}") {
                    get {
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
                }
            }
        }
    }
}