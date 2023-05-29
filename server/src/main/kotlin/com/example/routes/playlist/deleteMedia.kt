package com.example.routes.playlist

import arrow.core.flatMap
import com.example.external.mongo.MongoFunctions
import com.example.func.toEither
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.deleteMedia(mongoFunctions: MongoFunctions) =
    delete("/{playlistId}/media/{mediaId}") {
        call.parameters["playlistId"].toEither().flatMap { playlistId ->
            call.parameters["mediaId"].toEither().flatMap { mediaId ->
                val userId = "6472888133a5d88dea146111"
                mongoFunctions.deleteMediaF(userId, playlistId, mediaId)
            }
        }.fold({ call.respond(HttpStatusCode.InternalServerError) }, { call.respond(HttpStatusCode.OK) })
    }