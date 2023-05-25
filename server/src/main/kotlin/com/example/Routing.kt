package com.example

import arrow.core.left
import arrow.core.right
import com.example.dtos.QueuedMedia
import com.example.func.utcNow
import com.example.state.ServerState
import io.ktor.http.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import java.io.File
import java.util.*
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
            route("/rooms") {
                route("/{roomId}") {
                    get("/queue") {
                        val queuedMedia = listOf(
                            QueuedMedia(
                                userWhoQueued = "pete",
                                timeQueued = utcNow(),
                                videoId = "1"
                            ),
                            QueuedMedia(
                                userWhoQueued = "pete",
                                timeQueued = utcNow(),
                                videoId = "2"
                            ),
                            QueuedMedia(
                                userWhoQueued = "pete",
                                timeQueued = utcNow(),
                                videoId = "3"
                            )
                        )

                        val json = try {
                            Json.encodeToString(queuedMedia).right()
                        } catch (error: Error) {
                            error.left()
                        }

                        json.fold({ call.respond(HttpStatusCode.InternalServerError) }, { call.respondText(it) })
                    }
                }
            }
        }
    }
}