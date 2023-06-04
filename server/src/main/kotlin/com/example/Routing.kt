package com.example

import arrow.core.Either
import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.routes.playlist.getAllPlaylists
import com.example.routes.playlist.postNewMedia
import com.example.routes.room.getRoomById
import com.example.routes.room.postNewMediaToRoomQueue
import com.example.state.ServerState
import com.example.external.youtube.YoutubeFunctions
import com.example.func.encode
import com.example.routes.playlist.deleteMedia
import com.example.routes.playlist.patchMedia
import io.ktor.http.*
import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import java.io.File
import java.util.concurrent.atomic.AtomicReference

data class BadRequestError(override val message: String) : Error(message)
data class NotFoundError(override val message: String) : Error(message)

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
                    getRoomById(serverState)
                    postNewMediaToRoomQueue(mongoFunctions, serverState)
                }
            }
        }
    }
}

suspend inline fun <reified T> ApplicationCall.respondWith(response: Either<Error, T>) =
    response.flatMap {
        it.encode()
    }.fold({
        this.handleFailureResponse(it)
    }, {
        this.respondText(it)
    })

suspend fun ApplicationCall.handleFailureResponse(error: Error) =
    when (error) {
        is BadRequestError -> this.respond(HttpStatusCode.BadRequest)
        is NotFoundError -> this.respond(HttpStatusCode.NotFound)
        else -> {
            println(error.message + "\n" + error.stackTraceToString())
            this.respond(HttpStatusCode.InternalServerError)
        }
    }