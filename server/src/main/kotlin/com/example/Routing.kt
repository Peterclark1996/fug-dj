package com.example

import com.example.external.mongo.MongoFunctions
import com.example.external.youtube.YoutubeFunctions
import com.example.routes.playlist.deleteMedia
import com.example.routes.playlist.getAllPlaylists
import com.example.routes.playlist.patchMedia
import com.example.routes.playlist.postNewMedia
import com.example.routes.room.deleteMediaFromRoomQueue
import com.example.routes.room.getAllRooms
import com.example.routes.room.getRoomById
import com.example.routes.room.postNewMediaToRoomQueue
import com.example.routes.user.getAuthenticatedUser
import com.example.routes.user.putAuthenticatedUser
import com.example.state.ServerState
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
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

        authenticate("jwt") {
            route("/api") {
                route("/playlist") {
                    getAllPlaylists(mongoFunctions)
                    postNewMedia(mongoFunctions, youtubeFunctions)
                    deleteMedia(mongoFunctions)
                    patchMedia(mongoFunctions)
                }
                route("/room") {
                    getAllRooms(mongoFunctions, serverState)
                    getRoomById(mongoFunctions, serverState)
                    postNewMediaToRoomQueue(mongoFunctions, serverState)
                    deleteMediaFromRoomQueue(serverState)
                }
                route("/user") {
                    getAuthenticatedUser(mongoFunctions)
                    putAuthenticatedUser(mongoFunctions)
                }
            }
        }
    }
}