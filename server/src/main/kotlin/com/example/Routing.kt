package com.example

import com.example.external.mongo.MongoFunctions
import com.example.routes.playlist.getAllPlaylists
import com.example.routes.playlist.postNewMedia
import com.example.routes.room.getRoomById
import com.example.routes.room.postNewMediaToRoomQueue
import com.example.state.ServerState
import com.example.external.youtube.YoutubeFunctions
import com.example.routes.playlist.deleteMedia
import com.example.routes.playlist.patchMedia
import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import java.io.File
import java.util.concurrent.atomic.AtomicReference

fun Application.configureRouting(
    serverState: AtomicReference<ServerState>,
    mongoFunctions: MongoFunctions,
    youtubeFunctions: YoutubeFunctions
) {
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
                postNewMedia(mongoFunctions, youtubeFunctions)
                deleteMedia(mongoFunctions)
                patchMedia(mongoFunctions)
            }
            route("/room") {
                getRoomById()
                postNewMediaToRoomQueue(serverState)
            }
        }
    }
}