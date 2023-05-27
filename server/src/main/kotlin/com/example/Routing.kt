package com.example

import com.example.mongo.MongoFunctions
import com.example.routes.playlist.getAllPlaylists
import com.example.routes.room.getRoomById
import com.example.routes.room.postNewMediaToRoomQueue
import com.example.state.ServerState
import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import java.io.File
import java.util.concurrent.atomic.AtomicReference

fun Application.configureRouting(serverState: AtomicReference<ServerState>, mongoFunctions: MongoFunctions) {
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
            route("/playlist") {
                getAllPlaylists(mongoFunctions)
            }
            route("/room") {
                getRoomById()
                postNewMediaToRoomQueue(serverState)
            }
        }
    }
}